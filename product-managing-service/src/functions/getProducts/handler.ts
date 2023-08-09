import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import database from '../../models/database/Database';

export const getProducts = async (event: APIGatewayProxyEvent, context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    console.log("incoming request event getProducts:");
    console.log(event);
    const availableProducts = await database.getAllItems();

    return {
      statusCode: 200,
      body: JSON.stringify(availableProducts)
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMessage: "Error when retrieving products", error: e })
    }
  }
};

export const main = middyfy(getProducts);


/*export const handler = async (): Promise<APIGatewayProxyResultV2> => {
  const dbClient = new DynamoDBClient({region: 'us-east-1'});
  const command = new ScanCommand({TableName: process.env.TABLE_NAME});
  return dbClient
      .send(command)
      .then((data) => {
        return {
          statusCode: 200,
          body: JSON.stringify(data.Items?.map((item) => unmarshall(item))),
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: 'some error happened',
            error: error.message,
          }),
        };
      });
};*/

/*const [products, stocks] = await Promise.all([
  dynamo.send(new ScanCommand({ TableName: ProductsTableName })),
  dynamo.send(new ScanCommand({ TableName: StocksTableName })),
]);*/
