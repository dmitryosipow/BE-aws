import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { getProductList } from '@libs/products-service';

export const getProductById = async (event) => {
  const loadedProds = await getProductList();
  const id = event.pathParameters.id;
  const prod = loadedProds.find(el => el.id === id);
  if (!prod) {
    return {
      statusCode: 404,
      body: JSON.stringify({ errorMessage: "Product with this id not found" })
    }
  }
  return formatJSONResponse({
    product: prod,
    event,
  });
};

export const main = middyfy(getProductById);
