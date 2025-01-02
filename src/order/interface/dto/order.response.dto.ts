import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Order } from '../../domain/order';
import { OrderItem } from '../../domain/order-item';

export class OrderItemResponseDto extends OmitType(OrderItem, [
    'createdAt',
    'updatedAt',
] as const) {}

export class OrderResponseDto extends OmitType(Order, ['createdAt', 'updatedAt'] as const) {
    @ApiProperty({ type: [OrderItemResponseDto], description: '주문 상품 목록' })
    orderItems: OrderItemResponseDto[];
}
