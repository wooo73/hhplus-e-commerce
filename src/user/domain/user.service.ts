import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from './user.repository';
import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';
import { UserDomain } from './user';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { ErrorMessage } from '../../common/errorStatus';
import { RedisService } from '../../database/redis/redis.service';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
        private readonly redisService: RedisService,
    ) {}

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
        const { balance } = await this.getUserBalance(userId);

        const currentBalance = balance;
        const totalAmount = currentBalance + userChargePointRequestDto.amount;

        const affectedRow = await this.userRepository.increaseUserBalance(
            userId,
            currentBalance,
            totalAmount,
        );

        if (!affectedRow) {
            throw new BadRequestException(ErrorMessage.USER_BALANCE_INCREASE_FAILED);
        }
        const user = await this.getUserBalance(userId);

        return UserDomain.from(user);
    }

    async chargeUserBalanceWithRedLock(
        userId: number,
        userChargePointRequestDto: UserChargePointRequestDto,
    ): Promise<UserDomain> {
        let lock;

        try {
            const lockDuration = 300;

            const retryCount = 0;
            const retryDelay = 0;
            await this.redisService.setRedLock(retryCount, retryDelay);

            const key = `charge:${userId}:balance`;
            lock = await this.redisService.acquireLock(key, lockDuration);

            const { balance } = await this.getUserBalance(userId);

            const currentBalance = balance;
            const totalAmount = currentBalance + userChargePointRequestDto.amount;

            const affectedRow = await this.userRepository.increaseUserBalance(
                userId,
                currentBalance,
                totalAmount,
            );

            if (!affectedRow) {
                throw new BadRequestException(ErrorMessage.USER_BALANCE_INCREASE_FAILED);
            }
            const user = await this.getUserBalance(userId);

            return UserDomain.from(user);
        } catch (err) {
            throw err;
        } finally {
            await this.redisService.releaseLock(lock);
        }
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
