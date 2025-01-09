import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';
import { UserRepository } from '../domain/user.repository';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { UserEntity } from '../domain/user';

@Injectable()
export class UserPrismaRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: TransactionClient) {
        return tx ? tx.prisma : this.prisma;
    }

    async findById(userId: number, tx?: TransactionClient): Promise<UserEntity> {
        const client = this.getClient(tx);

        return await client.user.findUnique({ where: { id: userId } });
    }

    async updateUserBalance(
        userId: number,
        userChargePointRequestDto: UserChargePointRequestDto,
        tx?: TransactionClient,
    ): Promise<UserEntity> {
        const client = this.getClient(tx);

        return await client.user.update({
            where: { id: userId },
            data: { balance: { increment: userChargePointRequestDto.amount } },
        });
    }

    async decreaseUserBalance(
        userId: number,
        amount: number,
        tx?: TransactionClient,
    ): Promise<UserEntity> {
        const client = this.getClient(tx);

        return await client.user.update({
            where: { id: userId },
            data: { balance: { decrement: amount } },
        });
    }

    async findByIdWithLock(userId: number, tx?: TransactionClient): Promise<UserEntity> {
        const client = this.getClient(tx);

        const user = await client.$queryRaw<
            UserEntity[]
        >`SELECT * FROM user WHERE id = ${userId} FOR UPDATE`;

        return user[0];
    }
}
