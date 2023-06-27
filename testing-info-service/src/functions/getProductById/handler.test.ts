import { getProductById } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';

it('verifies successful response', async () => {
    const event:APIGatewayProxyEvent = {
        pathParameters: {
            id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3"
        }
    } as any
    const result = await getProductById(event)
    //test

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).product).toEqual(
    {
        description: "Short Product Description2",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
        price: 23,
        title: "Product"
    });
});

it('verifies unsuccessful response', async () => {
    const event:APIGatewayProxyEvent = {
        pathParameters: {
            id: "1"
        }
    } as any
    const result = await getProductById(event);

    expect(result.statusCode).toEqual(404);
});