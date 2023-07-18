import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import database from '../../models/database/Database';

export const getProductById = async (event, context) => {
  console.log('incoming request event getProductById:');
  console.log(event);
  const id = event.pathParameters.id;
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const item = await database.getById(id);

    if (!item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ errorMessage: "Product with this id not found" })
      }
    }

    return formatJSONResponse(item);
  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMessage: "Error getting product", error: e })
    }
  }
};

export const main = middyfy(getProductById);
