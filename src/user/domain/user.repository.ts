import { Prisma, User } from '@prisma/client';
import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';

export interface UserRepository {
    findById(userId: number, tx?: Prisma.TransactionClient): Promise<User>;
    updateUserBalance(
        userId: number,
        userChargePointRequestDto: UserChargePointRequestDto,
        tx?: Prisma.TransactionClient,
    ): Promise<User>;
}
export const USER_REPOSITORY = Symbol('userRepository');
