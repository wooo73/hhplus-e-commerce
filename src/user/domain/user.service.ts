import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from './user.repository';
import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';
import { UserDomain } from './user';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { ErrorMessage } from '../../common/errorStatus';

@Injectable()
export class UserService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

    async getUserBalance(userId: number, tx?: TransactionClient): Promise<UserDomain> {
        const user = await this.userRepository.findById(userId, tx);
        if (!user) {
            throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
        }
        return UserDomain.from(user);
    }

    async chargeUserBalance(
        userId: number,
        userChargePointRequestDto: UserChargePointRequestDto,
    ): Promise<UserDomain> {
        await this.getUserBalance(userId);
        const user = await this.userRepository.increaseUserBalance(
            userId,
            userChargePointRequestDto.amount,
        );
        return UserDomain.from(user);
    }

    async useUserBalance(
        userId: number,
        amount: number,
        tx: TransactionClient,
    ): Promise<UserDomain> {
        return await this.userRepository.decreaseUserBalance(userId, amount, tx);
    }

    async findByIdWithLock(userId: number, tx: TransactionClient): Promise<UserDomain> {
        const user = await this.userRepository.findByIdWithLock(userId, tx);
        if (!user) {
            throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
        }
        return UserDomain.from(user);
    }
}
