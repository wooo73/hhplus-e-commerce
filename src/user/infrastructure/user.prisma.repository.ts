import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserPrismaRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(userId: number): Promise<User> {
        return await this.prisma.user.findUnique({ where: { id: userId } });
    }

    async updateUserBalance(
        userId: number,
        userChargePointRequestDto: UserChargePointRequestDto,
    ): Promise<User> {
        console.log(typeof userChargePointRequestDto.amount);
        return await this.prisma.user.update({
            where: { id: userId },
            data: { balance: { increment: userChargePointRequestDto.amount } },
        });
    }
}
