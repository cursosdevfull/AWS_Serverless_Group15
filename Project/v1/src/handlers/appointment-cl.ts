type Event = {
  slotId: number;
  patientId: number;
  date: string;
  countryISO: "PE" | "CL" | "CO";
};

export const handler = async (event: Event) => {
  console.log("Event received in destination handler Chile:", event);

  const { slotId, patientId, date, countryISO } = event;

  return {
    statusCode: 200,
    body: JSON.stringify({ slotId, patientId, date, countryISO }),
  };
};
