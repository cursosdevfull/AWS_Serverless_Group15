import {
  InvocationType,
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from "@aws-sdk/client-lambda";

type Event = {
  operator1: number;
  operator2: number;
  operation: "sum" | "subtract" | "multiply" | "divide";
};

const client = new LambdaClient();

export const sender = async (event: Event) => {
  const input: InvokeCommandInput = {
    InvocationType: InvocationType.RequestResponse,
    FunctionName: process.env.FUNCTION_NAME,
    Payload: JSON.stringify({
      operator1: event.operator1,
      operator2: event.operator2,
      operation: event.operation,
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
