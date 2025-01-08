import { Test, TestingModule } from '@nestjs/testing';
import { CouponService } from './coupon.service';
import { COUPON_REPOSITORY, CouponRepository } from './coupon.repository';
import {
    TRANSACTION_MANAGER,
    TransactionManager,
} from '../../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../../common/transaction/prisma.transaction-client';
import { CouponPrismaRepository } from '../infrastructure/coupon.prisma.repository';
import { BadRequestException } from '@nestjs/common';

jest.mock('../../common/transaction/prisma.transaction-client.ts');
jest.mock('../infrastructure/coupon.prisma.repository');

describe('CouponService', () => {
    let service: CouponService;
    let repository;
    let transactionManager;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CouponService,
                {
                    provide: COUPON_REPOSITORY,
                    useClass: CouponPrismaRepository,
                },
                {
                    provide: TRANSACTION_MANAGER,
                    useClass: PrismaTransactionManager,
                },
            ],
        }).compile();

        service = module.get<CouponService>(CouponService);
        repository = module.get<CouponRepository>(COUPON_REPOSITORY);
        transactionManager = module.get<TransactionManager>(TRANSACTION_MANAGER);
    });

    describe('선착순 쿠폰 발급', () => {
        it('FAIL_쿠폰이 상태가 비정상 이거나 사용기간이 지났거나 발급한 쿠폰일 경우 "쿠폰이 유효하지 않습니다." 라는 에러를 던져야 합니다.', async () => {
            const couponId = 1;
            const userId = 1;

            repository.couponValidCheck.mockResolvedValue(false);

            await expect(service.issueCoupon(couponId, userId)).rejects.toThrow(
                new BadRequestException('쿠폰이 유효하지 않습니다.'),
            );
        });

        it('FAIL_쿠폰 재고가 없을 경우 "쿠폰 재고가 없습니다." 라는 에러를 던져야 합니다.', async () => {
            const couponId = 1;
            const userId = 1;

            repository.couponValidCheck.mockResolvedValue(true);
            repository.couponQuantityValidCheckWithLock.mockResolvedValue(false);
            transactionManager.transaction.mockImplementation(async (fn) => {
                await fn();
            });

            await expect(service.issueCoupon(couponId, userId)).rejects.toThrow(
                new BadRequestException('발급 수량이 초과되었습니다.'),
            );
        });
    });
});
