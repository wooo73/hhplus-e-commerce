import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '../../database/prisma/prisma.module';
import { CouponModule } from '../coupon.module';

import { ConfigService } from '@nestjs/config';
import { CouponController } from './coupon.controller';
import { CouponService } from '../domain/coupon.service';

import { TRANSACTION_MANAGER } from '../../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../../common/transaction/prisma.transaction-client';
import { CouponStatus } from '../../common/status';
import { createMockUser } from '../../../prisma/seed/user.seed';
import { createMockCoupon } from '../../../prisma/seed/coupon.seed';
import { RedisModule } from '../../database/redis/redis.module';
import { RedlockService } from '../../database/redis/redlock.service';

import { LoggerModule } from '../../common/logger/logger.module';

describe('CouponController', () => {
    let controller: CouponController;
    let redlockService: RedlockService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule, RedisModule, LoggerModule, CouponModule],
            controllers: [CouponController],
            providers: [
                ConfigService,
                {
                    provide: TRANSACTION_MANAGER,
                    useClass: PrismaTransactionManager,
                },
            ],
        }).compile();

        controller = module.get<CouponController>(CouponController);
        redlockService = module.get<RedlockService>(RedlockService);
    });

    afterEach(async () => {
        await redlockService.quit();
    });

    it('남은 쿠폰의 재고에 맞게 쿠폰이 발급되어야 한다.', async () => {
        //given
        const userCount = 10;
        const balance = 10000;
        const users = await Promise.all(
            Array.from({ length: userCount }, () => createMockUser(balance)),
        );

        const type = 'PERCENT';
        const discountValue = 10;
        const remainingQuantity = 5;

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
        expect(fulfilledResult.length).toEqual(remainingQuantity);
        expect(rejectedResult.length).toEqual(userCount - remainingQuantity);
    });

    describe('쿠폰 발급 통합 테스트(100번 동시 발급 요청)', () => {
        const userCount = 100;
        const balance = 10000;
        const type = 'PERCENT';
        const discountValue = 10;
        const remainingQuantity = 5;

        it('비관적락', async () => {
            //given
            const users = await Promise.all(
                Array.from({ length: userCount }, () => createMockUser(balance)),
            );

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
            expect(fulfilledResult.length).toEqual(remainingQuantity);
            expect(rejectedResult.length).toEqual(userCount - remainingQuantity);
        });

        it('분산락', async () => {
            //given
            const users = await Promise.all(
                Array.from({ length: userCount }, () => createMockUser(balance)),
            );

            const coupon = await createMockCoupon(
                CouponStatus.AVAILABLE,
                type,
                discountValue,
                remainingQuantity,
            );

            const userIds = users.map((user) => user.id);
            const couponId = coupon.id;

            //when
            const issueCouponPromise = Array.from({ length: userCount }, (_, index) =>
                controller.issueCouponWithRedis(couponId, userIds[index]),
            );

            const result = await Promise.allSettled(issueCouponPromise);

            const rejectedResult = result.filter((v) => v.status === 'rejected');
            const fulfilledResult = result.filter((v) => v.status === 'fulfilled');

            //then
            expect(fulfilledResult.length).toEqual(remainingQuantity);
            expect(rejectedResult.length).toEqual(userCount - remainingQuantity);
        });
    });
});
