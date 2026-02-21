import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    console.log("Processing record:", record.body);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Records processed successfully" }),
  };
};
