import {
  InvocationType,
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from "@aws-sdk/client-lambda";

type Event = {
  slotId: number;
  patientId: number;
  date: string;
  countryISO: "PE" | "CL" | "CO";
};

const client = new LambdaClient();

export const handler = async (event: Event) => {
  const functionName = process.env["FUNCTION_NAME_" + event.countryISO];

  const input: InvokeCommandInput = {
    InvocationType: InvocationType.RequestResponse,
    FunctionName: functionName,
    Payload: JSON.stringify({
      slotId: event.slotId,
      patientId: event.patientId,
      date: event.date,
      countryISO: event.countryISO,
    }),
  };

  const command = new InvokeCommand(input);
  const response = await client.send(command);

  let rpta: number | null = null;
  try {
    if (response.Payload) {
      const uint8Array = new Uint8Array(response.Payload);
      const returned = JSON.parse(
        String.fromCharCode.apply(null, Array.from(uint8Array)),
      );

      const body = JSON.parse(returned.body);
      rpta = Number(body);
    }
  } catch (error) {}

  return {
    statusCode: 200,
    body: JSON.stringify(rpta),
  };
};
