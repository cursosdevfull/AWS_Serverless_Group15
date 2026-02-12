import {
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent) => {
  const tableName = process.env.TABLE_NAME || "Appointments";

  const params: ScanCommandInput = {
    TableName: tableName,
  };

  const command = new ScanCommand(params);

  try {
    const response = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Appointments retrieved successfully",
        response,
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
