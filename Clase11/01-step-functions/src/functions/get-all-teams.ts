import * as s3 from "@aws-sdk/client-s3";
import { delay } from "../utils/utils";

const s3Client = new s3.S3Client();

export const handler = async () => {
  const random = Math.round(Math.random() * 3 + 1) * 1000;
  await delay(random); // Simulate a delay

  const teams = [
    { id: 1, name: "Team Alpha" },
    { id: 2, name: "Team Beta" },
    { id: 3, name: "Team Gamma" },
  ];

  const timestamp = new Date().toISOString();
  const key = `principal_service/${timestamp}-all-teams.json`;

  await s3Client.send(
    new s3.PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(teams),
      ContentType: "application/json",
    }),
  );

  return key;
};
