import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Product } from '../../domain/product';
import { ProductQuantity } from '../../domain/product-quantity';

class ProductQuantityDto extends PickType(ProductQuantity, [
    'quantity',
    'remainingQuantity',
] as const) {}

export class ProductResponseDto extends OmitType(Product, ['ProductQuantity'] as const) {
    @ApiProperty({ type: ProductQuantityDto })
    ProductQuantity: ProductQuantityDto;

    constructor(product: Product) {
        super();
        Object.assign(this, product);
    }

    static of(product: Product): ProductResponseDto {
        const dto = new ProductResponseDto(product);
        dto.ProductQuantity = {
            quantity: product.ProductQuantity?.quantity,
            remainingQuantity: product.ProductQuantity?.remainingQuantity,
        };
        return dto;
    }
}
