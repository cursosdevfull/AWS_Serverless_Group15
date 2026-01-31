import { APIGatewayProxyEvent, SQSEvent } from "aws-lambda";

type EventApiGateway = {
  body: string;
};

type EventBody = {
  name: string;
  lastname: string;
  email: string;
};

type EventSQS = {
  Records: Array<{ body: string }>;
};

export const register = async (event: SQSEvent | APIGatewayProxyEvent) => {
  /*   console.log("Event received:", event.body);
  const body: EventBody = JSON.parse(event.body);
  console.log("Parsed body:", body); */

  // Check if the event is from API Gateway
  if (event && "body" in event) {
    const body: EventBody = JSON.parse(event.body as string);
    console.log(
      `Registering user (API Gateway): ${body.name} ${body.lastname} with email: ${body.email}`,
    );
  }

  if ("Records" in event) {
    for (const record of event.Records) {
      const body: EventBody = JSON.parse(record.body);
      console.log(
        `Registering user (SQS): ${body.name} ${body.lastname} with email: ${body.email}`,
      );
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "User registered successfully" }),
  };
};
