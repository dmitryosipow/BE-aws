import { AvailableProduct, DBClient, Product, Stock } from '../index';
import { Repository } from './Database';

class DynamoService implements Repository<Product, string>
{
    async getAllItems(): Promise<AvailableProduct[]> {
        const loadedProds = await DBClient.scan({
            TableName: process.env.PRODUCT_TABLE,
        }).promise();

        const loadedStocks = await DBClient.scan({
            TableName: process.env.STOCKS_TABLE,
        }).promise();

        const stockMap = new Map(loadedStocks.Items.map((stock: Stock) => [stock.product_id, stock]));
        const availableProducts: AvailableProduct[] = (loadedProds.Items as Product[]).reduce((acc, product) => {
            const stock = stockMap.get(product.id);

            if(!stock?.count) {
                return acc;
            }

            acc.push({
                ...product,
                count: stock.count
            });

            return acc;
        }, [] as AvailableProduct[]);

        return availableProducts;
    }

    async getById(id: string): Promise<AvailableProduct> {
        const prod = await DBClient.get({
            TableName: process.env.PRODUCT_TABLE,
            Key: {
                id
            }
        }).promise();

        const stock = await DBClient.get({
            TableName: process.env.STOCKS_TABLE,
            Key: {
                product_id: id
            }
        }).promise();

        if (!prod.Item || !stock.Item) {
            return null;
        }

        const availableProduct: AvailableProduct = { ...(prod.Item as Product), count: stock.Item.count };

        return availableProduct;
    }

    async create(product) {
        const created = await DBClient.put({
            TableName: process.env.PRODUCT_TABLE,
            Item: product
        }).promise();

        return created;
    }
}

const DynamoServiceInst = new DynamoService();

export default DynamoServiceInst;