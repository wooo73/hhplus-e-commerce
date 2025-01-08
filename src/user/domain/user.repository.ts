import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';
import { TransactionClient } from 'src/common/transaction/transaction-client';
import { UserEntity } from './user';

export interface UserRepository {
    findById(userId: number, tx?: TransactionClient): Promise<UserEntity>;
    updateUserBalance(
        userId: number,
        userChargePointRequestDto: UserChargePointRequestDto,
        tx?: TransactionClient,
    ): Promise<UserEntity>;
}
export const USER_REPOSITORY = Symbol('userRepository');
