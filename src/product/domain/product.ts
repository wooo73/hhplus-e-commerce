import { ApiProperty } from '@nestjs/swagger';

export class Product {
    @ApiProperty({ example: 1, description: '상품 ID' })
    id: number;

    @ApiProperty({ example: '상품 이름', description: '상품 이름' })
    name: string;

    @ApiProperty({ example: 5_000, description: '상품 가격' })
    price: number;

    @ApiProperty({ example: true, description: '상품 주문 가능 여부' })
    status: boolean;

    @ApiProperty({ example: '2025-01-01', description: '생성일' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '수정일' })
    updatedAt: Date;
}
