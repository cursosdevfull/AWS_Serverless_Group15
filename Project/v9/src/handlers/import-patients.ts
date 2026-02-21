import { S3Event } from "aws-lambda";

import { DynamoDBLib, S3Lib } from "../lib";

const dynamoDBLib = new DynamoDBLib();
const s3Lib = new S3Lib();

function getPatients(content: string) {
  return content.split("\n").map((line) => line.split(","));
}

async function savePatients(patients: string[][], tableName: string) {
  for (const patient of patients) {
    const [patientId, name, phone, email, countryISO] = patient;

    const body = {
      patientId,
      name,
      phone,
      email,
      countryISO,
    };

    console.log("Saving patient:", body);

    await dynamoDBLib.putItem(tableName, body);
  }
}

export const handler = async (event: S3Event) => {
  const tableName = process.env.TABLE_NAME || "Patients";

  for (const record of event.Records) {
    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;

    const fileContent = await s3Lib.read(bucketName, objectKey);

    const patients = getPatients(fileContent).slice(1);

    await savePatients(patients, tableName);
  }
};
