import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserPrismaRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ? tx : this.prisma;
    }

    async findById(userId: number, tx?: Prisma.TransactionClient): Promise<User> {
        const client = this.getClient(tx);

        return await client.user.findUnique({ where: { id: userId } });
    }

    async findByIdWithLock(userId: number, tx?: Prisma.TransactionClient): Promise<User> {
        const client = this.getClient(tx);

        return await client.user.findUnique({ where: { id: userId } });
    }

    async updateUserBalance(
        userId: number,
        userChargePointRequestDto: UserChargePointRequestDto,
        tx?: Prisma.TransactionClient,
    ): Promise<User> {
        const client = this.getClient(tx);

        return await client.user.update({
            where: { id: userId },
            data: { balance: { increment: userChargePointRequestDto.amount } },
        });
    }
}
