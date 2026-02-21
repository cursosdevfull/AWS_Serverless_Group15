import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const input: QueryCommandInput = {
      TableName: process.env.TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :gsi1pk",
      ExpressionAttributeValues: marshall({
        ":gsi1pk": "CUSTOMER",
      }),
      // ExpresionAttributeValues: {
      //     ":gsi1pk": { S: "CUSTOMER" }
      // }
    };

    const command = new QueryCommand(input);
    const result = await client.send(command);

    const customers = (result.Items || []).map((item) => {
      const record = unmarshall(item);

      return {
        customerId: record.customerId,
        name: record.name,
        email: record.email,
        phone: record.phone,
        createdAt: record.createdAt,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        customers,
        count: customers.length,
      }),
    };
  } catch (error) {
    console.error("Error listing customers:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error listing customers",
        error,
      }),
    };
  }
};
