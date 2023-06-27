import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { getProductList } from '@libs/products-service';

// const products = [
//   {
//     "id": 1,
//     "productName": "Camera",
//     "price": 12,
//   },
//   {
//     "id": 2,
//     "productName": "Book",
//     "price": 2,
//   },
// ]

export const getProducts = async () => {
  try {
    const loadedProds = await getProductList();
    return formatJSONResponse(loadedProds);
  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMessage: "Product with this id not found" })
    }
  }
};

export const main = middyfy(getProducts);
