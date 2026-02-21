import { APIGatewayProxyEvent } from "aws-lambda";
import {
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";

const client = new SQSClient();

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { name, lastname, email } = JSON.parse(event.body || "{}");

  const input: SendMessageCommandInput = {
    MessageBody: JSON.stringify({ name, lastname, email }),
    QueueUrl: process.env.SQS_ELEMENT_URL,
  };

  const command = new SendMessageCommand(input);
  const response = await client.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
