import { PickType } from '@nestjs/swagger';
import { OrderEntity } from '../order';

export class CreateOrderDto extends PickType(OrderEntity, [
    'userId',
    'couponId',
    'totalAmount',
    'discountAmount',
    'finalAmount',
    'status',
] as const) {
    toEntity() {
        return OrderEntity.from(
            this.userId,
            this.couponId,
            this.totalAmount,
            this.discountAmount,
            this.finalAmount,
            this.status,
        );
    }
}
