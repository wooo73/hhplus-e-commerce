import { Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY, OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/create.order.dto';
import { CreateOrderItemDto } from './dto/create.order-item.dto';
import { TransactionClient } from 'src/common/transaction/transaction-client';
import { OrderItemEntity } from './order-item';

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
}
