import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

enum CountryISO {
  PE = "PE",
  CO = "CO",
  CL = "CL",
  MX = "MX",
}

interface CreateAppointmentParams {
  patientId: number;
  slotId: string;
  countryISO: CountryISO;
}

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body || "{}") as CreateAppointmentParams;

  const tableName = process.env.TABLE_NAME || "Appointments";

  const params: PutItemCommandInput = {
    TableName: tableName,
    Item: {
      patientId: { N: body.patientId.toString() },
      slotId: { S: body.slotId },
      countryISO: { S: body.countryISO },
    },
  };

  const command = new PutItemCommand(params);

  try {
    const response = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Appointment created successfully",
        response,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to create appointment", error }),
    };
  }
};
