import { APIGatewayProxyEvent } from "aws-lambda";
import { EventBridgeLib } from "../lib";

export const handler = async (event: APIGatewayProxyEvent) => {
  const { slotId, patientId, date, countryISO } = JSON.parse(
    event.body || "{}",
  );

  const eventBridge = new EventBridgeLib();
  const response = await eventBridge.publishMessage(
    "desktop-app",
    "appointment-create",
    { slotId, patientId, date, countryISO },
    process.env.EVENT_BUSNAME || "",
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Event sent to EventBridge",
      eventId: response.Entries?.[0].EventId,
    }),
  };
};
