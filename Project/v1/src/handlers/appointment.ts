import { LambdaInvocationType, LambdaLib } from "../lib/lambda-lib";

type Event = {
  slotId: number;
  patientId: number;
  date: string;
  countryISO: "PE" | "CL" | "CO";
};

export const handler = async (event: Event) => {
  const functionName = process.env["FUNCTION_NAME_" + event.countryISO];

  const lambdaLib = new LambdaLib();
  const response = await lambdaLib.invoke(
    functionName!,
    event,
    LambdaInvocationType.RequestResponse,
  );

  let rpta: number | null = null;
  try {
    if (response.Payload) {
      const returned = Buffer.from(response.Payload).toString();
      const { body } = JSON.parse(returned);
      rpta = JSON.parse(body);
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error processing response from invoked function",
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(rpta),
  };
};
