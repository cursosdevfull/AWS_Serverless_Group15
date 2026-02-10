import {
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from "@aws-sdk/client-lambda";

export enum LambdaInvocationType {
  Event = "Event",
  RequestResponse = "RequestResponse",
  DryRun = "DryRun",
}

type Invocation = keyof typeof LambdaInvocationType;

export class LambdaLib {
  private client: LambdaClient;

  constructor() {
    this.client = new LambdaClient();
  }

  public invoke(
    functionName: string,
    payload: Record<string, any>,
    invocationType: Invocation,
  ) {
    const input: InvokeCommandInput = {
      InvocationType: LambdaInvocationType[invocationType],
      FunctionName: functionName,
      Payload: JSON.stringify(payload),
    };

    const command = new InvokeCommand(input);
    return this.client.send(command);
  }
}
