
import { getProducts } from './handler';

it('verifies successful response', async () => {
    const result = await getProducts()
    //test

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).length).toEqual(6);
});