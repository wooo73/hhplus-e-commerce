import { GetProductsQueryDTO } from '../presentation/dto/product.request.dto';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { ProductEntity } from './product';
import { OrderProductRemainingQuantity } from '../infrastructure/types/product-quantity';
import { GetOrderProducts, specialProducts } from '../infrastructure/types/product';
import { ProductQuantityEntity } from './product-quantity';

export interface ProductRepository {
    getProducts(query: GetProductsQueryDTO): Promise<ProductEntity[]>;
    findAvailableOrderProducts(
        productIds: number[],
        tx?: TransactionClient,
    ): Promise<GetOrderProducts[]>;
    findOrderProductRemainingQuantityWithLock(
        productId: number,
        orderQuantity: number,
        tx?: TransactionClient,
    ): Promise<OrderProductRemainingQuantity[]>;
    decreaseProductRemainingQuantity(
        productId: number,
        orderQuantity: number,
        tx?: TransactionClient,
    ): Promise<ProductQuantityEntity>;
    getSpecialProducts(
        startDate: string,
        endDate: string,
        tx?: TransactionClient,
    ): Promise<specialProducts[]>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
