import { APIGatewayProxyEvent } from "aws-lambda";
import { SNSLib } from "../lib";
import { Event } from "../types";

export const handler = async (event: APIGatewayProxyEvent) => {
  const topicArn = process.env["TOPIC_ARN"]!;

  const body = event.body ? (JSON.parse(event.body) as Event) : {};

  const snsLib = new SNSLib();
  const response = await snsLib.publish(topicArn, body);

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
