import { PickType } from '@nestjs/swagger';
import { OrderItemEntity } from '../order-item';

export class CreateOrderItemDto extends PickType(OrderItemEntity, [
    'orderId',
    'productId',
    'quantity',
    'price',
] as const) {
    toEntity() {
        return OrderItemEntity.from(this.orderId, this.productId, this.quantity, this.price);
    }
}
