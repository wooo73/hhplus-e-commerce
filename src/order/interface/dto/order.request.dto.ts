import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Product } from 'src/product/domain/product';

class OrderProduct extends OmitType(Product, ['createdAt', 'updatedAt'] as const) {}

export class OrderRequestDto {
    @ApiProperty({ example: 1, description: '사용자 ID' })
    userId: number;

    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    couponId: number;

    @ApiProperty({ type: [OrderProduct], description: '주문 상품 정보' })
    Products: OrderProduct[];
}
