import {
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";

type Event = {
  operator1: number;
  operator2: number;
  operation: "sum" | "subtract" | "multiply" | "divide";
};

const client = new SQSClient();

export const sender = async (event: Event) => {
  const input: SendMessageCommandInput = {
    MessageBody: JSON.stringify(event),
    QueueUrl: process.env.SQS_ELEMENT_URL,
  };

  const command = new SendMessageCommand(input);
  const response = await client.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
