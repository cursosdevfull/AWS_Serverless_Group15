import {
  GetObjectCommand,
  GetObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

export class S3Lib {
  private client: S3Client;

  constructor() {
    this.client = new S3Client();
  }

  async read(bucketName: string, objectKey: string) {
    const input: GetObjectCommandInput = {
      Bucket: bucketName,
      Key: objectKey,
    };
    const command = new GetObjectCommand(input);
    const result = await this.client.send(command);
    return this.streamToString(result.Body as Readable);
  }

  private streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
  }
}
