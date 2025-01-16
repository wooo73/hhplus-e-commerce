import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CouponController } from './coupon.controller';
import { CouponService } from '../domain/coupon.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { COUPON_REPOSITORY } from '../domain/coupon.repository';
import { CouponPrismaRepository } from '../infrastructure/coupon.prisma.repository';
import { TRANSACTION_MANAGER } from '../../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../../common/transaction/prisma.transaction-client';
import { CouponStatus } from '../../common/status';
import { createMockUser } from '../../../prisma/seed/user.seed';
import { createMockCoupon } from '../../../prisma/seed/coupon.seed';

describe('CouponController', () => {
    let controller: CouponController;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CouponController],
            providers: [
                PrismaService,
                ConfigService,
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

        controller = module.get<CouponController>(CouponController);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('SUCCESS_2개의 수량이 남은 3번 쿠폰에 대해 7명의 사용자가 쿠폰 발급 요청시 2개의 쿠폰만 발급되어야 한다.', async () => {
        //given
        const userCount = 7;
        const balance = 10000;
        const users = await Promise.all(
            Array.from({ length: userCount }, () => createMockUser(balance)),
        );

        const type = 'PERCENT';
        const discountValue = 10;
        const remainingQuantity = 2;

        const coupon = await createMockCoupon(
            CouponStatus.AVAILABLE,
            type,
            discountValue,
            remainingQuantity,
        );

        const userIds = users.map((user) => user.id);
        const couponId = coupon.id;

        const length = userIds.length;

        //when
        const issueCouponPromise = Array.from({ length: length }, (_, index) =>
            controller.issueCoupon(couponId, userIds[index]),
        );

        const result = await Promise.allSettled(issueCouponPromise);

        const rejectedResult = result.filter((v) => v.status === 'rejected');
        const fulfilledResult = result.filter((v) => v.status === 'fulfilled');

        //then
        expect(fulfilledResult.length).toEqual(2);
        expect(rejectedResult.length).toEqual(5);
    });
});
