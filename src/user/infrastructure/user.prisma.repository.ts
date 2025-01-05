import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UserRepository } from '../application/user.repository';
import { User } from '../domain/user';
import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';

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
        return await this.prisma.user.update({
            where: { id: userId },
            data: { balance: { increment: userChargePointRequestDto.amount } },
        });
    }
}
