import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CouponController } from './coupon.controller';
import { CouponService } from '../domain/coupon.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { COUPON_REPOSITORY } from '../domain/coupon.repository';
import { CouponPrismaRepository } from '../infrastructure/coupon.prisma.repository';
import { TRANSACTION_MANAGER } from '../../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../../common/transaction/prisma.transaction-client';
import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../../../test/it/util';
import { CouponStatus } from '../../common/status';
import { UserDomain } from '../../user/domain/user';
import { CouponDomain } from '../domain/coupon';

let prisma: PrismaClient;

const createMockCouponAndUserCouponData = async () => {
    prisma = await getPrismaClient();

    const userCount = 7;
    const type = 'PERCENT';
    const discountValue = 10;
    const remainingQuantity = 2;

    const users = await Promise.all(
        Array.from({ length: userCount }, () =>
            prisma.user.create({
                data: { balance: 10000 },
            }),
        ),
    );

    const coupon = await prisma.coupon.create({
        data: {
            name: `coupon_test`,
            status: CouponStatus.AVAILABLE,
            discountType: type,
            discountValue: discountValue,
            startAt: new Date(),
            endAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
            couponQuantity: {
                create: {
                    quantity: 10,
                    remainingQuantity,
                },
            },
        },
    });

    return { users, coupon };
};

describe('CouponController', () => {
    let controller: CouponController;
    let prisma: PrismaService;
    let couponMockData: { users: UserDomain[]; coupon: CouponDomain };

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

        couponMockData = await createMockCouponAndUserCouponData();
    });

    it('SUCCESS_2개의 수량이 남은 3번 쿠폰에 대해 7명의 사용자가 쿠폰 발급 요청시 2개의 쿠폰만 발급되어야 한다.', async () => {
        //given

        const { users, coupon } = couponMockData;
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
