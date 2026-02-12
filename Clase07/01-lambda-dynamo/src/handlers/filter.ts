import {
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent) => {
  const tableName = process.env.TABLE_NAME || "Appointments";
  const { patientId } = event.pathParameters!;

  const params: ScanCommandInput = {
    TableName: tableName,
    ExpressionAttributeValues: {
      ":patientId": { N: patientId! },
    },
    ExpressionAttributeNames: {
      "#PATIENT_ID": "patientId",
      "#SLOT_ID": "slotId",
    },
    FilterExpression: "#PATIENT_ID = :patientId",
    ProjectionExpression: "#PATIENT_ID, #SLOT_ID",
  };

  const command = new ScanCommand(params);

  try {
    const response = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Appointments retrieved successfully",
        response: response.Items?.map((item) => unmarshall(item)),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to retrieve appointments",
        error,
      }),
    };
  }
};
