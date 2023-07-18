import { getProducts } from './handler';
import database from '../../models/database/Database';

jest.mock('../../models/database/Database');
const mockedDatabase = database as jest.Mocked<typeof database>;

describe('getProductById', () => {
    beforeEach(() => {
        mockedDatabase.getAllItems.mockImplementation(() => Promise.resolve(Array(6)));
    });

    it('verifies successful response', async () => {
        const result = await getProducts({} as any, {})

        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body).length).toEqual(6);
    });
});