import * as products from '../functions/getProducts/products.json';

export const getProductList = () => Promise.resolve(products.default);