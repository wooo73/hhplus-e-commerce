import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from './user.repository';
import { User } from '@prisma/client';
import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';

@Injectable()
export class UserService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

    async getUserBalance(userId: number): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return user;
    }

    async chargeUserBalance(
        userId: number,
        userChargePointRequestDto: UserChargePointRequestDto,
    ): Promise<User> {
        try {
            await this.getUserBalance(userId);
            return await this.userRepository.updateUserBalance(userId, userChargePointRequestDto);
        } catch (err) {
            throw err;
        }
    }
}
