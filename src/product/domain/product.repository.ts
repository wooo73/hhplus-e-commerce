import { Product } from '@prisma/client';
import { GetProductsQueryDTO } from '../presentation/dto/product.request.dto';

export interface ProductRepository {
    getProducts(query: GetProductsQueryDTO): Promise<Product[]>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
