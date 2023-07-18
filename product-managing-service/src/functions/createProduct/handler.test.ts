import database from '../../models/database/Database';
import { createProduct } from './handler';
import { APIGatewayProxyResult } from 'aws-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import schema from '@functions/createProduct/schema';

jest.mock('../../models/database/Database');
const mockedDatabase = database as jest.Mocked<typeof database>;

const item = {
    description: "Short Product Description2",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    price: 23,
    title: "Product"
}

describe('getProductById', () => {
    beforeEach(() => {
        mockedDatabase.create.mockImplementation(() => Promise.resolve(item));
    });

    it('verifies successful response', async () => {
        const event: ValidatedEventAPIGatewayProxyEvent<typeof schema> = {
            body: item
        } as any;
        const result = await createProduct(event as any, {} as any, () => {}) as APIGatewayProxyResult;

        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body).price).toEqual(item.price);
    });

    it('verifies incorrect data schema', async () => {
        const event: ValidatedEventAPIGatewayProxyEvent<typeof schema> = {
            body: {
                price: 24
            }
        } as any;
        const result = await createProduct(event as any, {} as any, () => {}) as APIGatewayProxyResult;

        expect(result.statusCode).toEqual(400);
    });
});