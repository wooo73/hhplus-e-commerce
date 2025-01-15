import { ProductQuantity } from '@prisma/client';
import { ProductWithQuantityDomain } from './product-with-quantity';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { ProductQuantityDomain } from './product-quantity';

export interface ProductRepository {
    findProducts(offset: number, size: number): Promise<ProductWithQuantityDomain[]>;
    findAvailableOrderProducts(
        productIds: number[],
        tx?: TransactionClient,
    ): Promise<ProductWithQuantityDomain[]>;
    findOrderProductRemainingQuantityWithLock(
        productId: number,
        orderQuantity: number,
        tx?: TransactionClient,
    ): Promise<ProductQuantityDomain>;
    decreaseProductRemainingQuantity(
        productId: number,
        orderQuantity: number,
        tx?: TransactionClient,
    ): Promise<ProductQuantity>;
    findSpecialProducts(
        startDate: string,
        endDate: string,
        tx?: TransactionClient,
    ): Promise<
        { productId: number; name: string; price: number; status: string; orderQuantity: number }[]
    >;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
