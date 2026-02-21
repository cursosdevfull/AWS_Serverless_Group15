import {
  PublishCommand,
  PublishCommandInput,
  SNSClient,
} from "@aws-sdk/client-sns";

export class SNSLib {
  private client: SNSClient;

  constructor() {
    this.client = new SNSClient();
  }

  private generatePublishCommand(
    topicArn: string,
    message: string,
  ): PublishCommandInput {
    return {
      Message: message,
      TopicArn: topicArn,
    };
  }

  public publish(topicArn: string, message: Record<string, any>) {
    const input = this.generatePublishCommand(
      topicArn,
      JSON.stringify(message),
    );
    const command = new PublishCommand(input);
    return this.client.send(command);
  }
}
