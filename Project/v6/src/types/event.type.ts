export type Event = {
  slotId: number;
  patientId: number;
  date: string;
  countryISO: "PE" | "CL" | "CO" | "MX";
};

export type EnrichedEvent = Event & {
  historyNumber: number;
  enriched: boolean;
  enrichedAt: string;
};
