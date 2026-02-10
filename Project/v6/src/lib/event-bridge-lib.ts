import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput,
  PutEventsCommandOutput,
} from "@aws-sdk/client-eventbridge";

export class EventBridgeLib {
  private client: EventBridgeClient;

  constructor() {
    this.client = new EventBridgeClient();
  }

  private generateMessageCommandInput(
    source: string,
    detailType: string,
    detail: Record<string, any>,
    eventBusName: string,
  ): PutEventsCommandInput {
    return {
      Entries: [
        {
          Source: source,
          DetailType: detailType,
          Detail: JSON.stringify(detail),
          EventBusName: eventBusName,
        },
      ],
    };
  }

  public publishMessage(
    source: string,
    detailType: string,
    detail: Record<string, any>,
    eventBusName: string,
  ): Promise<PutEventsCommandOutput> {
    const input = this.generateMessageCommandInput(
      source,
      detailType,
      detail,
      eventBusName,
    );
    const command = new PutEventsCommand(input);
    return this.client.send(command);
  }
}
