import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const hello = async (event) => {
  return formatJSONResponse({
    message: `Hello world, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = middyfy(hello);
