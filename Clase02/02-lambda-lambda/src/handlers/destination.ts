export const handler = async (event: any) => {
  console.log("Event received in destination handler:", event);

  const { operator1, operator2, operation } = event;

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

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
