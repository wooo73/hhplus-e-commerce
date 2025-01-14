import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UserRepository } from '../domain/user.repository';
import { TransactionClient } from '../../common/transaction/transaction-client';

@Injectable()
export class UserPrismaRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: TransactionClient) {
        return tx ? tx.prisma : this.prisma;
    }

    async findById(userId: number, tx?: TransactionClient): Promise<User> {
        const client = this.getClient(tx);

        return await client.user.findUnique({ where: { id: userId } });
    }

    async increaseUserBalance(
        userId: number,
        amount: number,
        tx?: TransactionClient,
    ): Promise<User> {
        const client = this.getClient(tx);

        return await client.user.update({
            where: { id: userId },
            data: { balance: { increment: amount } },
        });
    }

    async decreaseUserBalance(
        userId: number,
        amount: number,
        tx?: TransactionClient,
    ): Promise<User> {
        const client = this.getClient(tx);

        return await client.user.update({
            where: { id: userId },
            data: { balance: { decrement: amount } },
        });
    }

    async findByIdWithLock(userId: number, tx?: TransactionClient): Promise<User> {
        const client = this.getClient(tx);

        return await client.$queryRaw`SELECT * FROM user WHERE id = ${userId} FOR UPDATE`;
    }
}
