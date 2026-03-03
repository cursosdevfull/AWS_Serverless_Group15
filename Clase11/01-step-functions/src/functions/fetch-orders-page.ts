import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { delay } from "../utils/utils";

const s3Client = new S3Client();

export const handler = async (event: any) => {
  const { teamId, apiKey, name } = event;
  const orders = [
    { orderId: 101, item: "Widget A", quantity: 5 },
    { orderId: 102, item: "Widget B", quantity: 3 },
    { orderId: 103, item: "Widget C", quantity: 7 },
  ];

  const random = Math.round(Math.random() * 3 + 1) * 1000;
  await delay(random); // Simulate a delay

  const teamInfo = {
    teamId,
    name,
    apiKeyUsed: apiKey,
  };

  // Guardar los datos en un JSON en el bucket
  const ordersData = {
    orders,
    teamInfo,
    timestamp: new Date().toISOString(),
    ordersCount: orders.length,
  };

  const ordersKey = `orders/team-${teamId}-${Date.now()}.json`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: ordersKey,
      Body: JSON.stringify(ordersData),
      ContentType: "application/json",
    }),
  );

  return {
    orders,
    teamInfo,
    ordersLocation: ordersKey, // Retornamos la ubicación del archivo en S3
  };
};
