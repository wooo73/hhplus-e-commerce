import { GetProductsQueryDTO } from '../presentation/dto/product.request.dto';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { ProductEntity } from './product';
import { OrderProductRemainingQuantity } from '../infrastructure/types/product-quantity';
import { GetOrderProducts } from '../infrastructure/types/product';

export interface ProductRepository {
    getProducts(query: GetProductsQueryDTO): Promise<ProductEntity[]>;
    findAvailableOrderProducts(
        productIds: number[],
        tx?: TransactionClient,
    ): Promise<GetOrderProducts[]>;
    findOrderProductRemainingQuantityWithLock(
        productIds: number[],
        tx?: TransactionClient,
    ): Promise<OrderProductRemainingQuantity[]>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
