import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";

import { marshall } from "@aws-sdk/util-dynamodb";

export class DynamoDBLib {
  private client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({});
  }

  async putItem(tableName: string, item: any) {
    const params: PutItemCommandInput = {
      TableName: tableName,
      Item: marshall(item),
    };

    const command = new PutItemCommand(params);
    await this.client.send(command);
  }
}
