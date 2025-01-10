import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from './user.repository';
import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';
import { UserEntity } from './user';
import { TransactionClient } from '../../common/transaction/transaction-client';

@Injectable()
export class UserService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

    async getUserBalance(userId: number, tx?: TransactionClient): Promise<UserEntity> {
        const user = await this.userRepository.findById(userId, tx);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return user;
    }

    async chargeUserBalance(
        userId: number,
        userChargePointRequestDto: UserChargePointRequestDto,
    ): Promise<UserEntity> {
        try {
            await this.getUserBalance(userId);
            return await this.userRepository.updateUserBalance(userId, userChargePointRequestDto);
        } catch (err) {
            throw err;
        }
    }

    async useUserBalance(
        userId: number,
        amount: number,
        tx: TransactionClient,
    ): Promise<UserEntity> {
        return await this.userRepository.decreaseUserBalance(userId, amount, tx);
    }

    async findByIdWithLock(userId: number, tx: TransactionClient): Promise<UserEntity> {
        const user = await this.userRepository.findByIdWithLock(userId, tx);
        if (!user) {
            new NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return user;
    }
}
