import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput,
} from "@aws-sdk/client-eventbridge";
import { APIGatewayProxyEvent } from "aws-lambda";

const client = new EventBridgeClient();

export const sender = async (event: APIGatewayProxyEvent) => {
  const { slotId, patientId, date, countryISO } = JSON.parse(
    event.body || "{}",
  );

  const input: PutEventsCommandInput = {
    Entries: [
      {
        Source: "desktop-app",
        DetailType: "appointment-create",
        Detail: JSON.stringify({ slotId, patientId, date, countryISO }),
        EventBusName: process.env.EVENT_BUSNAME,
      },
    ],
  };

  const command = new PutEventsCommand(input);

  const response = await client.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Event sent to EventBridge",
      eventId: response.Entries?.[0].EventId,
    }),
  };
};
