import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Keys } from "../models/types";

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const customerId = event.pathParameters?.customerId!;
    const keys = Keys.customer(customerId);

    const input: GetItemCommandInput = {
      TableName: process.env.TABLE_NAME,
      Key: marshall(keys),
    };

    const command = new GetItemCommand(input);

    const result = await client.send(command);

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Customer not found" }),
      };
    }

    const customer = unmarshall(result.Item);

    return {
      statusCode: 200,
      body: JSON.stringify({
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        createdAt: customer.createdAt,
      }),
    };
  } catch (error) {
    console.error("Error retrieving customer:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to retrieve customer", error }),
    };
  }
};
