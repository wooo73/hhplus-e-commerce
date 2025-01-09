import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY, OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/create.order.dto';
import { CreateOrderItemDto } from './dto/create.order-item.dto';
import { TransactionClient } from 'src/common/transaction/transaction-client';
import { OrderItemEntity } from './order-item';
import { OrderEntity } from './order';
import { OrderFindById } from '../infrastructure/types/order';
import { OrderStatus } from 'src/common/status';

@Injectable()
export class OrderService {
    constructor(@Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository) {}

    async createOrder(orderDto: CreateOrderDto, tx: TransactionClient) {
        return await this.orderRepository.createOrder(orderDto.toEntity(), tx);
    }

    async createOrderItem(
        orderItemDto: CreateOrderItemDto,
        tx: TransactionClient,
    ): Promise<OrderItemEntity> {
        return await this.orderRepository.createOrderItem(orderItemDto.toEntity(), tx);
    }

    async getOrder(orderId: number, userId: number, tx: TransactionClient): Promise<OrderFindById> {
        const order = await this.orderRepository.findById(orderId, userId, tx);
        if (!order) {
            throw new NotFoundException('주문 정보를 찾을 수 없습니다.');
        }
        return order;
    }

    async payOrder(orderId: number, tx: TransactionClient): Promise<OrderEntity> {
        return await this.orderRepository.updateOrderStatus(orderId, OrderStatus.PAID, tx);
    }
}
