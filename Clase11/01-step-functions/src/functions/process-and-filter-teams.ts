import * as s3 from "@aws-sdk/client-s3";

const s3Client = new s3.S3Client();

export const handler = async (event: any) => {
  const { teamsLocation, apiKeysLocation } = event;

  const teamsResponse = await s3Client.send(
    new s3.GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: teamsLocation,
    }),
  );

  const apiKeysResponse = await s3Client.send(
    new s3.GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: apiKeysLocation,
    }),
  );

  const teams = JSON.parse(await teamsResponse.Body!.transformToString());
  const apiKeys = JSON.parse(await apiKeysResponse.Body!.transformToString());

  const apiKeyMap = new Map<number, string>();
  for (const apiKeyEntry of apiKeys) {
    apiKeyMap.set(apiKeyEntry.teamId, apiKeyEntry.apiKey);
  }

  const teamsToProcess = [];
  for (const team of teams) {
    if (apiKeyMap.has(team.id)) {
      teamsToProcess.push({
        id: team.id,
        name: team.name,
        apiKey: apiKeyMap.get(team.id),
      });
    }
  }

  console.log("Fetched Teams:", teams);
  console.log("Fetched API Keys:", apiKeys);

  return {
    teamsToProcess,
    totalTeams: teams.length,
    teamsWithCredentials: teamsToProcess.length,
  };
};
