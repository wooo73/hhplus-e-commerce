import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProductEntity } from '../../domain/product';
import { ProductQuantityEntity } from '../../domain/product-quantity';
import { Product } from '@prisma/client';

export class ProductQuantityDto extends PickType(ProductQuantityEntity, [
    'quantity',
    'remainingQuantity',
] as const) {}

export class ProductResponseDto extends ProductEntity {
    @ApiProperty({ type: ProductQuantityDto })
    ProductQuantity: ProductQuantityDto;

    constructor(product: Product) {
        super();
        Object.assign(this, product);
    }

    static of(product: Product) {
        return new ProductResponseDto(product);
    }
}
