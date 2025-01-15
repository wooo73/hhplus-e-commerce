import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY, OrderRepository } from './order.repository';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { OrderDomain } from './order';
import { OrderItemDomain } from './order-item';
import { OrderWithItemDomain } from './order-with-item';
import { OrderStatus } from '../../common/status';
import { ErrorMessage } from '../../common/errorStatus';
import { CreateOrderDto } from './dto/create.order.dto';
import { CreateOrderItemDto } from './dto/create.order-item.dto';

@Injectable()
export class OrderService {
    constructor(@Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository) {}

    async createOrder(orderDto: CreateOrderDto, tx: TransactionClient): Promise<OrderDomain> {
        return await this.orderRepository.createOrder(orderDto, tx);
    }

    async createOrderItem(
        orderItemDto: CreateOrderItemDto,
        tx: TransactionClient,
    ): Promise<OrderItemDomain> {
        return await this.orderRepository.createOrderItem(orderItemDto, tx);
    }

    async getOrder(
        orderId: number,
        userId: number,
        tx: TransactionClient,
    ): Promise<OrderWithItemDomain> {
        const order = await this.orderRepository.findById(orderId, userId, tx);
        if (!order) {
            throw new NotFoundException(ErrorMessage.ORDER_NOT_FOUND);
        }
        return order;
    }

    async payOrder(orderId: number, tx: TransactionClient): Promise<OrderDomain> {
        return await this.orderRepository.updateOrderStatus(orderId, OrderStatus.PAID, tx);
    }
}
