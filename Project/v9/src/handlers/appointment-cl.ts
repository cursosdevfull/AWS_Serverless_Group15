import { EnrichedEvent } from "../types";

export const handler = async (events: EnrichedEvent[]) => {
  console.log("Event received in destination handler Chile:", events);

  const results: EnrichedEvent[] = [];

  for (const event of events) {
    const {
      slotId,
      patientId,
      date,
      countryISO,
      historyNumber,
      enriched,
      enrichedAt,
    } = event;

    console.log(
      `Processing appointment for patient ${patientId} on ${date} in ${countryISO} (slot ${slotId}) with history number ${historyNumber}, enriched: ${enriched}, enriched at: ${enrichedAt})`,
    );

    results.push({
      slotId,
      patientId,
      date,
      countryISO,
      historyNumber,
      enriched,
      enrichedAt,
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
