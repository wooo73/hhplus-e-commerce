import { OrderEntity } from './order';
import { OrderItemEntity } from './order-item';
import { TransactionClient } from 'src/common/transaction/transaction-client';

export interface OrderRepository {
    createOrder(order: OrderEntity, tx?: TransactionClient): Promise<OrderEntity>;
    createOrderItem(orderItem: OrderItemEntity, tx?: TransactionClient): Promise<OrderItemEntity>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
