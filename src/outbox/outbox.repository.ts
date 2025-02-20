import { Injectable } from '@nestjs/common';
import { outbox } from '@prisma/client';
import { KafkaOutboxStatus } from 'src/common/status';
import { TransactionClient } from 'src/common/transaction/transaction-client';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class OutboxRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: TransactionClient) {
        return tx ? tx.prisma : this.prisma;
    }

    async createOutbox(
        outbox: {
            messageId: string;
            topic: string;
            message: string;
            status: string;
        },
        tx?: TransactionClient,
    ): Promise<outbox> {
        const client = this.getClient(tx);

        return await client.outbox.create({ data: outbox });
    }

    async findUniqueOutbox(
        messageId: string,
        status: string,
        tx?: TransactionClient,
    ): Promise<outbox> {
        const client = this.getClient(tx);

        return await client.outbox.findFirst({ where: { messageId, status } });
    }

    async updateOutbox(messageId: string, status: string, tx?: TransactionClient): Promise<outbox> {
        const client = this.getClient(tx);

        return await client.outbox.update({ where: { messageId }, data: { status } });
    }

    async findUncommitOutbox(tx?: TransactionClient): Promise<outbox[]> {
        const client = this.getClient(tx);

        return await client.outbox.findMany({ where: { status: KafkaOutboxStatus.PUBLISH } });
    }
}
