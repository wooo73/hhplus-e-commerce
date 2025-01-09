import { ApiProperty, OmitType } from '@nestjs/swagger';
import { OrderEntity } from '../../domain/order';
import { OrderItemEntity } from '../../domain/order-item';

export class OrderItemResponseDto extends OmitType(OrderItemEntity, [
    'createdAt',
    'updatedAt',
] as const) {}

export class OrderResponseDto extends OrderEntity {
    orderItems: OrderItemResponseDto[];
}
