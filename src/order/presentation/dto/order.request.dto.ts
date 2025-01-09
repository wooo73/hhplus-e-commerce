import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderItemEntity } from '../../../order/domain/order-item';

class OrderProduct extends PickType(OrderItemEntity, ['productId', 'quantity'] as const) {}

export class OrderRequestDto {
    @ApiProperty({ example: 1, description: '사용자 ID' })
    userId: number;

    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    couponId: number;

    @ApiProperty({ type: [OrderProduct], description: '주문 상품 정보' })
    products: OrderProduct[];
}
