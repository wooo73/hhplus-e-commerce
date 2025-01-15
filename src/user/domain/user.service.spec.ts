import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { USER_REPOSITORY } from './user.repository';
import { UserPrismaRepository } from '../infrastructure/user.prisma.repository';
import { ErrorMessage } from '../../common/errorStatus';

jest.mock('../infrastructure/user.prisma.repository');

describe('UserService', () => {
    let service: UserService;
    let userRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, { provide: USER_REPOSITORY, useClass: UserPrismaRepository }],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get<UserPrismaRepository>(USER_REPOSITORY);
    });

    it('FAIL_사용자 조회 실패시 "사용자를 찾을 수 없습니다." 라는 에러를 던져야 합니다.', async () => {
        //given
        const userId = 1;
        userRepository.findById.mockResolvedValue(null);

        //when & then
        await expect(service.getUserBalance(userId)).rejects.toThrow(
            new NotFoundException(ErrorMessage.USER_NOT_FOUND),
        );
    });

    it('FAIL_사용자 잔액 충전에서 사용자 조회 실패시 "사용자를 찾을 수 없습니다." 라는 에러를 던져야 합니다.', async () => {
        //given
        const userId = 1;
        const userChargePointRequestDto = {
            amount: 1000,
        };
        userRepository.findById.mockResolvedValue(null);

        //when & then
        await expect(service.chargeUserBalance(userId, userChargePointRequestDto)).rejects.toThrow(
            new NotFoundException(ErrorMessage.USER_NOT_FOUND),
        );
    });
});
