import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Keys, OrderItem } from "../models/types";

const client = new DynamoDBClient();

type CreateOrderBody = {
  customerId: string;
  items: Omit<OrderItem, "orderId">[];
};

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const customerId = event.pathParameters?.customerId!;
    const { PK, SK_PREFIX } = Keys.ordersByCustomer(customerId);

    const input: QueryCommandInput = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": { S: PK },
        ":sk": { S: SK_PREFIX },
      },
    };

    const command = new QueryCommand(input);

    const result = await client.send(command);

    const orders = (result.Items || []).map((item) => {
      const record = unmarshall(item);

      return {
        orderId: record.orderId,
        status: record.status,
        total: record.total,
        createdAt: record.createdAt,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ customerId, orders, count: orders.length }),
    };
  } catch (error) {
    console.error("Error getting orders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error getting orders", error }),
    };
  }
};
