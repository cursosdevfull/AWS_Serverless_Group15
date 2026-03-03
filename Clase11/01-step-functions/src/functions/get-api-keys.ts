import * as s3 from "@aws-sdk/client-s3";
import { delay } from "../utils/utils";

const s3Client = new s3.S3Client();

export const handler = async () => {
  const random = Math.round(Math.random() * 3 + 1) * 1000;
  await delay(random); // Simulate a delay

  const apiKeys = [
    { teamId: 1, apiKey: "api_key_alpha_123" },
    { teamId: 2, apiKey: "api_key_beta_456" },
    { teamId: 3, apiKey: "api_key_gamma_789" },
  ];

  const timestamp = new Date().toISOString();
  const key = `principal_service/${timestamp}-api-keys.json`;

  await s3Client.send(
    new s3.PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(apiKeys),
      ContentType: "application/json",
    }),
  );

  console.log(`API keys stored in S3 with key: ${key}`);

  return key;
};
