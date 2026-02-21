import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent) => {
  const batchItemFailures = [];

  console.log("Received event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const random = Math.random();
    if (random < 0.5) {
      console.log("Processing record:", record.body);
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return batchItemFailures;
};
