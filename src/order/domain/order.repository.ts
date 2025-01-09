import { OrderStatus } from 'src/common/status';
import { OrderFindById } from '../infrastructure/types/order';
import { OrderEntity } from './order';
import { OrderItemEntity } from './order-item';
import { TransactionClient } from 'src/common/transaction/transaction-client';

export interface OrderRepository {
    createOrder(order: OrderEntity, tx?: TransactionClient): Promise<OrderEntity>;
    createOrderItem(orderItem: OrderItemEntity, tx?: TransactionClient): Promise<OrderItemEntity>;
    findById(orderId: number, userId: number, tx: TransactionClient): Promise<OrderFindById>;
    updateOrderStatus(
        orderId: number,
        status: OrderStatus,
        tx: TransactionClient,
    ): Promise<OrderEntity>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
