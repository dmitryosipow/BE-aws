import { getProductById } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import database from '../../models/database/Database';

const context = {};
const item = {
    description: "Short Product Description2",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    price: 23,
    title: "Product"
}

jest.mock('../../models/database/Database');
const mockedDatabase = database as jest.Mocked<typeof database>;

describe('getProductById', () => {
    beforeEach(() => {
        mockedDatabase.getById.mockImplementation(() => Promise.resolve(item))
    });

    it('verifies successful response', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3"
            }
        } as any;
        const result = await getProductById(event, context)

        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body)).toEqual(item);
    });

    it('verifies unsuccessful response', async () => {
        mockedDatabase.getById.mockImplementation(() => Promise.resolve(null))
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                id: "1"
            }
        } as any
        const result = await getProductById(event, context);

        expect(result.statusCode).toEqual(404);
    });
});