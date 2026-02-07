import { SQSEvent } from "aws-lambda";

export const handler = async (event: any) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  if (event.Records) {
    for (const record of event.Records) {
      console.log("Processing record:", JSON.stringify(record, null, 2));
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Event processed successfully", event }),
  };
};
