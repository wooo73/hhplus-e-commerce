import { OrderEntity } from '../../../order/domain/order';
import { OrderItemEntity } from '../../../order/domain/order-item';

export class OrderFindById extends OrderEntity {
    orderItem: OrderItemEntity[];
}
