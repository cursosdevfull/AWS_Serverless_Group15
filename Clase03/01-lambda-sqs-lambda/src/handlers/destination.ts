import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent) => {
  console.log("Event received in destination handler:", event);

  const results: number[] = [];

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    const { operator1, operator2, operation } = messageBody;

    let result: number = 0;
    switch (operation) {
      case "sum":
        result = operator1 + operator2;
        break;
      case "subtract":
        result = operator1 - operator2;
        break;
      case "multiply":
        result = operator1 * operator2;
        break;
      case "divide":
        result = operator1 / operator2;
        break;
    }

    results.push(result);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
