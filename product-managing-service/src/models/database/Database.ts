import { Product } from '../index';
import DynamoService from './DynamoService';
import MySqlService from './MySqlService';

export interface Repository<T, K> {
    getAllItems(): Promise<T[]>;
    getById(param: K): Promise<T>|null;
    create(obj: T): Promise<any>;
}

const getDatabase = ():Repository<Product, string> => {
    if ( process.env.database === 'DB') {
        return DynamoService;
    }

    return MySqlService;
}

const database = getDatabase();

export default database;
