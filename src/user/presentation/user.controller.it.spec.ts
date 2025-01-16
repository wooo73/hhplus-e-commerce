import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../domain/user.service';
import { USER_REPOSITORY } from '../domain/user.repository';
import { UserPrismaRepository } from '../infrastructure/user.prisma.repository';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createMockUser } from '../../../prisma/seed/user.seed';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                PrismaService,
                ConfigService,
                UserService,
                { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('SUCCESS_1번 사용자에 대한 충전이 정상 작동해야합니다.', async () => {
        //given
        const balance = 10000;
        const mockUser = await createMockUser(balance);
        const userId = mockUser.id;
        const userChargePointRequestDto = {
            amount: 500,
        };

        //when
        const user = await controller.getUserBalance(userId);
        const charge = await controller.chargePoint(userId, userChargePointRequestDto);

        //then
        expect(charge.balance).toBe(user.balance + userChargePointRequestDto.amount);
    });

    it('SUCCESS_1번 사용자가 동시에 충전을 진행하여도 순차적으로 작동해야합니다.', async () => {
        //given
        const balance = 10000;
        const mockUser = await createMockUser(balance);
        const userId = mockUser.id;
        const userChargePointRequestDto = {
            amount: 500,
        };

        const callTimes = 5;
        const user = await controller.getUserBalance(userId);

        //when
        const chargePromise = Array.from({ length: callTimes }, () =>
            controller.chargePoint(userId, userChargePointRequestDto),
        );
        await Promise.all(chargePromise);

        const result = await controller.getUserBalance(userId);

        //then
        expect(result.balance).toBe(user.balance + userChargePointRequestDto.amount * callTimes);
    });
});
