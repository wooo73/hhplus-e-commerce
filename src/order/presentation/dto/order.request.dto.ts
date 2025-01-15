import { ApiProperty } from '@nestjs/swagger';

class OrderProduct {
    @ApiProperty({ example: 1, description: '상품 ID' })
    productId: number;

    @ApiProperty({ example: 1, description: '상품 수량' })
    quantity: number;
}

export class OrderRequestDto {
    @ApiProperty({ example: 1, description: '사용자 ID' })
    userId: number;

    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    couponId: number;

    @ApiProperty({ type: [OrderProduct], description: '주문 상품 정보' })
    products: OrderProduct[];
}
