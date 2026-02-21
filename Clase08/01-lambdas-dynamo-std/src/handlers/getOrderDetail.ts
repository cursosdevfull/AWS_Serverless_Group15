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
    const orderId = event.pathParameters?.orderId!;
    const { PK, SK_PREFIX } = Keys.itemsByOrder(orderId);

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

    const items = (result.Items || []).map((item) => {
      const record = unmarshall(item);

      return {
        productId: record.productId,
        productName: record.productName,
        quantity: record.quantity,
        unitPrice: record.unitPrice,
        subtotal: record.quantity * record.unitPrice,
      };
    });

    const inputOrder: QueryCommandInput = {
      TableName: process.env.TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :gsi1pk",
      ExpressionAttributeValues: {
        ":gsi1pk": { S: `ORDER#${orderId}` },
      },
    };

    const commandOrder = new QueryCommand(inputOrder);
    const resultOrder = await client.send(commandOrder);

    const orderRecord = resultOrder.Items?.[0]
      ? unmarshall(resultOrder.Items[0])
      : null;

    return {
      statusCode: 200,
      body: JSON.stringify({
        orderId,
        status: orderRecord?.status,
        total: orderRecord?.total,
        customerId: orderRecord?.customerId,
        createdAt: orderRecord?.createdAt,
        items,
        itemsCount: items.length,
      }),
    };
  } catch (error) {
    console.error("Error getting order detail:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error getting order detail", error }),
    };
  }
};
