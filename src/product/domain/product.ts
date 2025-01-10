import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';

export class ProductEntity implements Product {
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
}
