import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import crypto from "crypto";
import { Keys, OrderItem, OrderItemRecord, OrderRecord } from "../models/types";

const client = new DynamoDBClient();

type CreateOrderBody = {
  customerId: string;
  items: Omit<OrderItem, "orderId">[];
};

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body!) as CreateOrderBody;
    const { customerId, items } = body;

    const orderId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const orderKeys = Keys.order(customerId, orderId);
    const orderRecord: OrderRecord = {
      ...orderKeys,
      GSI1PK: `ORDER#${orderId}`,
      GSI1SK: `ORDER#${createdAt}`,
      entityType: "ORDER",
      orderId,
      customerId,
      status: "PENDING",
      total,
      createdAt,
    };

    const itemRecords: OrderItemRecord[] = items.map((item) => {
      const itemKeys = Keys.orderItem(orderId, item.productId);

      return {
        ...itemKeys,
        GSI1PK: `PRODUCT#${item.productId}`,
        GSI1SK: `ORDER#${orderId}`,
        entityType: "ORDER_ITEM" as const,
        orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      };
    });

    const allRecords = [orderRecord, ...itemRecords];

    const putRequests = allRecords.map((record) => ({
      PutRequest: { Item: marshall(record) },
    }));

    const input: BatchWriteItemCommandInput = {
      RequestItems: {
        [process.env.TABLE_NAME!]: putRequests,
      },
    };

    const command = new BatchWriteItemCommand(input);

    await client.send(command);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Order created successfully",
        orderId,
        total,
        itemsCount: items.length,
      }),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to create order", error }),
    };
  }
};
