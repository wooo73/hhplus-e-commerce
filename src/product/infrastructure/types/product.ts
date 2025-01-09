import { ProductEntity } from 'src/product/domain/product';

export class GetOrderProducts extends ProductEntity {
    productQuantity: {
        productId: number;
        remainingQuantity: number;
    };
}
