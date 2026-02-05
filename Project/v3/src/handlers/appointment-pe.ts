import { SQSEvent } from "aws-lambda";
import { Event } from "../types";

export const handler = async (event: SQSEvent) => {
  console.log("Event received in destination handler Perú:", event);

  const results: Event[] = [];

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    const { slotId, patientId, date, countryISO } = messageBody;

    console.log(
      `Processing appointment for patient ${patientId} on ${date} in ${countryISO} (slot ${slotId})`,
    );

    results.push({ slotId, patientId, date, countryISO });
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
