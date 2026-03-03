export const handler = async (event: any) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    body: "ok",
  };
};
