import { middyfy } from '@libs/lambda';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import Ajv from 'ajv';

import schema from './schema';
import database from '../../models/database/Database';
import { createProductObject } from '../../utils/createProduct';

const ajv = new Ajv();
const validate = ajv.compile(schema);

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    console.log("incoming request event createProduct:");
    console.log(event);

    const validatedProdObject = createProductObject(event.body);

    if (validatedProdObject.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errorMessage: "Error creating product, incorrect input parameters",
          error: validate.errors
        })
      }
    }

    const created = await database.create(validatedProdObject.product);

    return {
      statusCode: 200,
      body: JSON.stringify(created)
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMessage: "Error creating product", error: e })
    }
  }
};

export const main = middyfy(createProduct);
