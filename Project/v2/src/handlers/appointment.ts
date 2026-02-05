import { SQSLib } from "../lib";

type Event = {
  slotId: number;
  patientId: number;
  date: string;
  countryISO: "PE" | "CL" | "CO";
};

export const handler = async (event: Event) => {
  const sqlUrl = process.env["SQS_URL_" + event.countryISO]!;

  const sqsLib = new SQSLib();
  const response = await sqsLib.sendMessage(sqlUrl, event);

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
