import { User } from '@prisma/client';
import { TransactionClient } from '../../common/transaction/transaction-client';

export interface UserRepository {
    findById(userId: number, tx?: TransactionClient): Promise<User>;
    increaseUserBalance(userId: number, amount: number, tx?: TransactionClient): Promise<User>;
    decreaseUserBalance(userId: number, amount: number, tx?: TransactionClient): Promise<User>;
    findByIdWithLock(userId: number, tx?: TransactionClient): Promise<User>;
}
export const USER_REPOSITORY = Symbol('userRepository');
