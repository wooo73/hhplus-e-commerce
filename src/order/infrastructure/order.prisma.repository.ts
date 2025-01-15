import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../domain/order.repository';
import { PrismaService } from '../../database/prisma/prisma.service';
import { OrderDomain } from '../domain/order';
import { OrderItemDomain } from '../domain/order-item';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { OrderStatus } from '../../common/status';
import { OrderWithItemDomain } from '../domain/order-with-item';
import { CreateOrderDto } from '../domain/dto/create.order.dto';

@Injectable()
export class OrderPrismaRepository implements OrderRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: TransactionClient) {
        return tx ? tx.prisma : this.prisma;
    }

    async createOrder(order: CreateOrderDto, tx?: TransactionClient): Promise<OrderDomain> {
        const client = this.getClient(tx);

        const data = await client.order.create({ data: order });
        return OrderDomain.from(data);
    }

    async createOrderItem(
        orderItem: OrderItemDomain,
        tx?: TransactionClient,
    ): Promise<OrderItemDomain> {
        const client = this.getClient(tx);

        const data = await client.orderItem.create({ data: orderItem });
        return OrderItemDomain.from(data);
    }

    async findById(
        orderId: number,
        userId: number,
        tx: TransactionClient,
    ): Promise<OrderWithItemDomain> {
        const client = this.getClient(tx);

        const orderWithItem = await client.order.findUnique({
            where: { id: orderId, userId },
            include: { orderItem: true },
        });

        return OrderWithItemDomain.from(orderWithItem);
    }

    async updateOrderStatus(
        orderId: number,
        status: OrderStatus,
        tx: TransactionClient,
    ): Promise<OrderDomain> {
        const client = this.getClient(tx);

        const data = await client.order.update({ where: { id: orderId }, data: { status } });
        return OrderDomain.from(data);
    }
}
