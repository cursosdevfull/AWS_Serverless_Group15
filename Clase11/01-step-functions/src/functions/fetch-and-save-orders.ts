import { delay } from "../utils/utils";

export const handler = async (event: any) => {
  const { order, teamInfo, ordersLocation } = event;

  const random = Math.round(Math.random() * 2 + 1) * 1000;
  await delay(random); // Simulate processing delay

  // Process the individual order
  const processedOrder = {
    ...order,
    processedAt: new Date().toISOString(),
    status: "processed",
    teamId: teamInfo.teamId,
    teamName: teamInfo.name,
  };

  console.log("Processed order:", JSON.stringify(processedOrder));

  return {
    success: true,
    processedOrder,
    teamInfo,
    originalLocation: ordersLocation,
  };
};
