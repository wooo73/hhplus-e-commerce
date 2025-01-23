import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
        currentBalance: number,
        amount: number,
        tx: TransactionClient,
    ): Promise<void> {
        if (amount > currentBalance) {
            throw new BadRequestException(ErrorMessage.USER_BALANCE_NOT_ENOUGH);
        }

        const totalAmount = currentBalance - amount;

        const affectedRow = await this.userRepository.decreaseUserBalance(
            userId,
            currentBalance,
            totalAmount,
            tx,
        );

        if (!affectedRow) {
            throw new BadRequestException(ErrorMessage.USER_BALANCE_DECREASE_FAILED);
        }
    }

    async findByIdWithLock(userId: number, tx: TransactionClient): Promise<UserDomain> {
        const user = await this.userRepository.findByIdWithLock(userId, tx);
        if (!user) {
            throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
        }
        return UserDomain.from(user);
    }
}
