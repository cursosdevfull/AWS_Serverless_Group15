import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Customer, CustomerRecord, Keys } from "../models/types";

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body!) as Omit<Customer, "createdAt">;

    const { customerId, name, email, phone } = body;

    const keys = Keys.customer(customerId);
    const createdAt = new Date().toISOString();

    const record: CustomerRecord = {
      ...keys,
      GSI1PK: "CUSTOMER",
      GSI1SK: `CUSTOMER#${customerId}`,
      entityType: "CUSTOMER",
      customerId,
      name,
      email,
      phone,
      createdAt,
    };

    const input: PutItemCommandInput = {
      TableName: process.env.TABLE_NAME,
      Item: marshall(record),
      ConditionExpression: "attribute_not_exists(PK)",
    };

    const command = new PutItemCommand(input);
    await client.send(command);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Customer created successfully",
        customerId,
      }),
    };
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "Customer already exists",
        }),
      };
    }

    console.error("Error creating customer:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to create customer",
        error,
      }),
    };
  }
};
