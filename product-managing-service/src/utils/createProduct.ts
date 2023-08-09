import { Product } from '../models';
import { v4 } from "uuid";
import Ajv from 'ajv';
import schema from '@functions/createProduct/schema';

const ajv = new Ajv();
const validate = ajv.compile(schema);

export const createProductObject = (data) => {
    const { title, description = '', price } = data;
    const product: Product = {
        id: v4(),
        title,
        description,
        price
    }

    const valid = validate(product);

    if (!valid) {
        return {
            product,
            error: validate.errors
        }
    }
    return {
        product,
        error: null
    };
}