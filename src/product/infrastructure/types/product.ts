import { ProductStatus } from 'src/common/status';
import { ProductEntity } from 'src/product/domain/product';

export class GetOrderProducts extends ProductEntity {
    productQuantity: {
        productId: number;
        remainingQuantity: number;
    };
}

export class specialProducts {
    productId: number;
    name: string;
    price: number;
    status: ProductStatus;
    orderQuantity: number;
}
