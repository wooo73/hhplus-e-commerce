import { User } from '@prisma/client';
import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';

export interface UserRepository {
    findById(userId: number): Promise<User>;
    updateUserBalance(
        userId: number,
        userChargePointRequestDto: UserChargePointRequestDto,
    ): Promise<User>;
}

export const USER_REPOSITORY = Symbol('userRepository');
