import { ApiProperty } from '@nestjs/swagger';

export class ProductQuantityDto {
    @ApiProperty({ example: 10, description: '총 재고' })
    quantity: number;

    @ApiProperty({ example: 5, description: '남은 재고' })
    remainingQuantity: number;
}

export class ProductResponseDto {
    @ApiProperty({ example: 1, description: '상품 ID' })
    id: number;

    @ApiProperty({ example: '상품 이름', description: '상품 이름' })
    name: string;

    @ApiProperty({ example: 5_000, description: '상품 가격' })
    price: number;

    @ApiProperty({ example: 'IN_STOCK', description: '상품 주문 가능 여부' })
    status: string;

    @ApiProperty({ example: '2025-01-01', description: '생성일' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '수정일' })
    updatedAt: Date;

    @ApiProperty({ type: ProductQuantityDto })
    productQuantity: ProductQuantityDto;

    static from({
        id,
        name,
        price,
        status,
        createdAt,
        updatedAt,
        productQuantity,
    }: {
        id: number;
        name: string;
        price: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productQuantity: { quantity: number; remainingQuantity: number };
    }) {
        const dto = new ProductResponseDto();
        dto.id = id;
        dto.name = name;
        dto.price = price;
        dto.status = status;
        dto.createdAt = createdAt;
        dto.updatedAt = updatedAt;
        dto.productQuantity = productQuantity;
        return dto;
    }
}

export class SpecialProductResponseDto {
    @ApiProperty({ example: 1, description: '상품 ID' })
    productId: number;

    @ApiProperty({ example: '상품 이름', description: '상품 이름' })
    name: string;

    @ApiProperty({ example: 10000, description: '상품 가격' })
    price: number;

    @ApiProperty({ example: 'IN_STOCK', description: '상품 상태' })
    status: string;

    @ApiProperty({ example: 10, description: '최근 3일 기준 주문수' })
    orderQuantity: number;

    static from({ productId, name, price, status, orderQuantity }) {
        const dto = new SpecialProductResponseDto();
        dto.productId = productId;
        dto.name = name;
        dto.price = price;
        dto.status = status;
        dto.orderQuantity = orderQuantity;
        return dto;
    }
}
