import { OrderStatus } from '../../common/status';
import { OrderDomain } from './order';
import { OrderItemDomain } from './order-item';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { OrderWithItemDomain } from './order-with-item';
import { CreateOrderDto } from './dto/create.order.dto';
import { CreateOrderItemDto } from './dto/create.order-item.dto';

export interface OrderRepository {
    createOrder(order: CreateOrderDto, tx?: TransactionClient): Promise<OrderDomain>;
    createOrderItem(
        orderItem: CreateOrderItemDto,
        tx?: TransactionClient,
    ): Promise<OrderItemDomain>;
    findById(orderId: number, userId: number, tx: TransactionClient): Promise<OrderWithItemDomain>;
    updateOrderStatus(
        orderId: number,
        status: OrderStatus,
        tx: TransactionClient,
    ): Promise<OrderDomain>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
