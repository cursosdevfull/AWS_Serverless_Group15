import { SQSEvent } from "aws-lambda";
import { LambdaInvocationType, LambdaLib } from "../lib";
import { EnrichedEvent, Event } from "../types";

const lambda = new LambdaLib();

function enrichAppointmentData(appointment: Event): EnrichedEvent {
  // Simulate data enrichment by adding a new field
  return {
    ...appointment,
    historyNumber: Math.floor(Math.random() * 1000), // Simulated history number
    enriched: true,
    enrichedAt: new Date().toISOString(),
  };
}

export const handler = async (event: SQSEvent) => {
  console.log("Event received in destination handler Colombia:", event);

  const batchItemFailures = [];

  for (const record of event.Records) {
    try {
      const random = Math.random();

      if (random < 0.5) {
        throw new Error("An error happened");
      }

      const messageBody = JSON.parse(record.body);
      const { slotId, patientId, date, countryISO } = messageBody;

      console.log(
        `Processing appointment for patient ${patientId} on ${date} in ${countryISO} (slot ${slotId})`,
      );

      const results = enrichAppointmentData({
        slotId,
        patientId,
        date,
        countryISO,
      });

      const functionName = process.env.FUNCTION_NAME!;
      await lambda.invoke(
        functionName,
        results,
        LambdaInvocationType.RequestResponse,
      );
    } catch (error) {
      console.error("Error processing appointment:", error);
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return batchItemFailures;
};
