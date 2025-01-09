import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProductEntity } from '../../domain/product';
import { ProductQuantityEntity } from '../../domain/product-quantity';
import { Product } from '@prisma/client';
import { specialProducts } from 'src/product/infrastructure/types/product';
import { ProductStatus } from 'src/common/status';

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

export class SpecialProductResponseDto extends specialProducts {
    @ApiProperty({ example: 1, description: '상품 ID' })
    productId: number;
    @ApiProperty({ example: '상품 이름', description: '상품 이름' })
    name: string;
    @ApiProperty({ example: 10000, description: '상품 가격' })
    price: number;
    @ApiProperty({ example: '판매중', description: '상품 상태' })
    status: ProductStatus;
    @ApiProperty({ example: 10, description: '최근 3일 기준 주문수' })
    orderQuantity: number;
}
