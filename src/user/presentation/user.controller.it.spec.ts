import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../domain/user.service';
import { USER_REPOSITORY } from '../domain/user.repository';
import { UserPrismaRepository } from '../infrastructure/user.prisma.repository';
import { ConfigService } from '@nestjs/config';
import { createMockUser } from '../../../prisma/seed/user.seed';
import { RedisModule } from '../../database/redis/redis.module';
import { RedlockService } from '../../database/redis/redlock.service';
import { PrismaModule } from '../../database/prisma/prisma.module';

import { TRANSACTION_MANAGER } from '../../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../../common/transaction/prisma.transaction-client';

describe('UserController', () => {
    let controller: UserController;
    let redlockService: RedlockService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [RedisModule, PrismaModule],
            controllers: [UserController],
            providers: [
                ConfigService,
                UserService,
                { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
                { provide: TRANSACTION_MANAGER, useClass: PrismaTransactionManager },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        redlockService = module.get<RedlockService>(RedlockService);
    });

    afterEach(async () => {
        await redlockService.quit();
    });

    it('사용자에 대한 충전이 정상 작동한다.', async () => {
        //given
        const balance = 10000;
        const mockUser = await createMockUser(balance);
        const userId = mockUser.id;
        const userChargePointRequestDto = {
            amount: 500,
        };

        //when
        const user = await controller.chargePoint(userId, userChargePointRequestDto);

        //then
        expect(user.balance).toBe(mockUser.balance + userChargePointRequestDto.amount);
    });

    it('동시에 중복 충전 요청이 올 경우 유저의 잔액은 한번만 증가해야 한다.', async () => {
        //given
        const balance = 0;
        const mockUser = await createMockUser(balance);
        const userId = mockUser.id;
        const userChargePointRequestDto = {
            amount: 500,
        };

        const callTimes = 30;

        const chargePromise = Array.from({ length: callTimes }, () =>
            controller.chargePoint(userId, userChargePointRequestDto),
        );

        //when
        const result = await Promise.allSettled(chargePromise);

        //then
        const fulfilled = result.filter((p) => p.status === 'fulfilled');
        const rejected = result.filter((p) => p.status === 'rejected');

        expect(fulfilled.length).toEqual(1);
        expect(rejected.length).toEqual(callTimes - 1);

        const user = await controller.getUserBalance(userId);
        expect(user.balance).toBe(mockUser.balance + userChargePointRequestDto.amount);
    });

    describe('잔액 충전 잠금 통합 테스트(중복 100번 동시 충전 요청)', () => {
        const balance = 1500;
        const callTimes = 100;

        const userChargePointRequestDto = {
            amount: 500,
        };

        it('낙관적락', async () => {
            //given
            const mockUser = await createMockUser(balance);
            const userId = mockUser.id;

            const chargePromise = Array.from({ length: callTimes }, () =>
                controller.chargePoint(userId, userChargePointRequestDto),
            );

            //when
            const result = await Promise.allSettled(chargePromise);

            //then
            const fulfilled = result.filter((p) => p.status === 'fulfilled');
            const rejected = result.filter((p) => p.status === 'rejected');

            expect(fulfilled.length).toEqual(1);
            expect(rejected.length).toEqual(callTimes - 1);

            const user = await controller.getUserBalance(userId);
            expect(user.balance).toBe(mockUser.balance + userChargePointRequestDto.amount);
        });

        it('분산락', async () => {
            //given
            const mockUser = await createMockUser(balance);
            const userId = mockUser.id;

            const chargePromise = Array.from({ length: callTimes }, () =>
                controller.chargePointWithRedis(userId, userChargePointRequestDto),
            );

            //when
            const result = await Promise.allSettled(chargePromise);

            //then
            const fulfilled = result.filter((p) => p.status === 'fulfilled');
            const rejected = result.filter((p) => p.status === 'rejected');

            expect(fulfilled.length).toEqual(1);
            expect(rejected.length).toEqual(callTimes - 1);

            const user = await controller.getUserBalance(userId);
            expect(user.balance).toBe(mockUser.balance + userChargePointRequestDto.amount);
        });
    });
});
