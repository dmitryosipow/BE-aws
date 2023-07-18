import { Product } from './index';

export default interface AvailableProduct extends Product {
    count: number;
}