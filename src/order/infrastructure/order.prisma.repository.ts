import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../domain/order.repository';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { OrderEntity } from '../domain/order';
import { Prisma } from '@prisma/client';
import { OrderItemEntity } from '../domain/order-item';
import { TransactionClient } from 'src/common/transaction/transaction-client';

@Injectable()
export class OrderPrismaRepository implements OrderRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: TransactionClient) {
        return tx ? tx.prisma : this.prisma;
    }

    async createOrder(order: OrderEntity, tx?: TransactionClient): Promise<OrderEntity> {
        const client = this.getClient(tx);

        return await client.order.create({ data: order });
    }
    async createOrderItem(
        orderItem: OrderItemEntity,
        tx?: TransactionClient,
    ): Promise<OrderItemEntity> {
        const client = this.getClient(tx);

        return await client.orderItem.create({ data: orderItem });
    }
}
