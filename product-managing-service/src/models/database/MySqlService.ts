import { AvailableProduct, Product } from '../index';
import { Repository } from './Database';
import * as mysql from 'mysql2';
import Stock from '../Stock';

const pool = mysql.createPool({
    host     : process.env.db_host,
    user     : process.env.db_user,
    password : process.env.db_password,
    port     : Number(process.env.db_port),
    database : process.env.db_database
}).promise();

class MySqlService implements Repository<Product, string>
{
    async getAllItems(): Promise<AvailableProduct[]> {
        const connection = await pool.getConnection();
        const result = await connection.query('SELECT * FROM Product JOIN Stocks ON Product.id = Stocks.product_id;');

        await connection.release();

        return result[0] as AvailableProduct[];
    }

    async getById(id: string): Promise<AvailableProduct> {
        const connection = await pool.getConnection();
        const result = await connection.query(`SELECT * FROM Product JOIN Stocks ON Product.id = Stocks.product_id where product_id = '${id}'`);

        await connection.release();

        return result[0][0] as AvailableProduct;
    }

    async create(product: Product) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query(`INSERT INTO Product(id, title, description, price)
                        VALUE('${product.id}', '${product.title}', '${product.description}', '${product.price}')`);
            const stockItem = await connection.query(`SELECT * FROM Stocks where product_id = '${product.id}'`);
            const stock = stockItem[0][0] as Stock
            if (!stock) {
                await connection.query(`INSERT INTO Stocks(product_id, count)
                        VALUE('${product.id}', '1')`);
            } else {
                await connection.query(`UPDATE Stocks SET count='${stock.count + 1}'
                        WHERE product_id = '${product.id}'`);
            }
            await connection.commit();
        } catch (e) {
            await connection.rollback();
            throw e;
        }

        await connection.release();

        return product;
    }
}

const inst = new MySqlService();

export default inst;