import {
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageCommandOutput,
  SQSClient,
} from "@aws-sdk/client-sqs";

export class SQSLib {
  private client: SQSClient;

  constructor() {
    this.client = new SQSClient();
  }

  private generateSendMessageCommandInput(
    queueUrl: string,
    message: string,
  ): SendMessageCommandInput {
    return {
      MessageBody: message,
      QueueUrl: queueUrl,
    };
  }

  public sendMessage(
    queueUrl: string,
    message: Record<string, any>,
  ): Promise<SendMessageCommandOutput> {
    const input = this.generateSendMessageCommandInput(
      queueUrl,
      JSON.stringify(message),
    );
    const command = new SendMessageCommand(input);
    return this.client.send(command);
  }
}
