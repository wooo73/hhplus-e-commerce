import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { OrderFacade } from '../application/order.facade';
import { OrderService } from '../domain/order.service';
import { UserService } from '../../user/domain/user.service';
import { CouponService } from '../../coupon/domain/coupon.service';
import { ProductService } from '../../product/domain/product.service';
import { ORDER_REPOSITORY } from '../domain/order.repository';
import { USER_REPOSITORY } from '../../user/domain/user.repository';
import { COUPON_REPOSITORY } from '../../coupon/domain/coupon.repository';
import { PRODUCT_REPOSITORY } from '../../product/domain/product.repository';
import { TRANSACTION_MANAGER } from '../../common/transaction/transaction-client';
import { OrderPrismaRepository } from '../infrastructure/order.prisma.repository';
import { UserPrismaRepository } from '../../user/infrastructure/user.prisma.repository';
import { CouponPrismaRepository } from '../../coupon/infrastructure/coupon.prisma.repository';
import { ProductPrismaRepository } from '../../product/infrastructure/product.prisma.repository';
import { PrismaTransactionManager } from '../../common/transaction/prisma.transaction-client';
import { OrderRequestDto } from './dto/order.request.dto';
import { UserDomain } from '../../user/domain/user';
import { CouponDomain } from '../../coupon/domain/coupon';
import { UserCouponDomain } from '../../coupon/domain/userCoupon';
import { CouponQuantityDomain } from '../../coupon/domain/coupon-quantity';
import { CouponStatus, OrderStatus } from '../../common/status';
import { getPrismaClient } from '../../../test/it/util';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export const createMockOrderData = async () => {
    prisma = await getPrismaClient();

    //사용자 생성
    const user = await prisma.user.create({
        data: { balance: 100000 },
    });

    //쿠폰 생성
    const coupon = await prisma.coupon.create({
        data: {
            name: 'order_test',
            status: CouponStatus.AVAILABLE,
            discountType: 'PERCENT',
            discountValue: 10,
            startAt: new Date(),
            endAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
            couponQuantity: { create: { quantity: 10, remainingQuantity: 10 } },
        },
    });

    //쿠폰 지급
    const userCoupon = await prisma.userCoupon.create({
        data: { user: { connect: { id: user.id } }, coupon: { connect: { id: coupon.id } } },
    });

    //쿠폰 재고 차감
    const couponQuantity = await prisma.couponQuantity.update({
        where: {
            couponId: coupon.id,
        },
        data: {
            remainingQuantity: {
                decrement: 1,
            },
        },
    });

    return { user, coupon, userCoupon, couponQuantity };
};

describe('OrderController', () => {
    let controller: OrderController;
    let prisma: PrismaService;

    //mock 데이터
    let orderMockData: {
        user: UserDomain;
        coupon: CouponDomain;
        userCoupon: UserCouponDomain;
        couponQuantity: CouponQuantityDomain;
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrderController],
            providers: [
                PrismaService,
                ConfigService,
                OrderFacade,
                OrderService,
                UserService,
                CouponService,
                ProductService,
                { provide: ORDER_REPOSITORY, useClass: OrderPrismaRepository },
                { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
                { provide: COUPON_REPOSITORY, useClass: CouponPrismaRepository },
                { provide: PRODUCT_REPOSITORY, useClass: ProductPrismaRepository },
                { provide: TRANSACTION_MANAGER, useClass: PrismaTransactionManager },
            ],
        }).compile();

        controller = module.get<OrderController>(OrderController);

        orderMockData = await createMockOrderData();
    });

    it('SUCCESS_쿠폰을 사용한 경우 주문이 정상적으로 완료되어야 합니다.', async () => {
        const userId = orderMockData.user.id;
        const userCouponId = orderMockData.userCoupon.id;

        const orderRequestDto: OrderRequestDto = {
            userId,
            couponId: userCouponId,
            products: [
                { productId: 1, quantity: 1 },
                { productId: 2, quantity: 2 },
            ],
        };

        const result = await controller.createOrder(orderRequestDto);

        expect(result.userId).toEqual(userId);
        expect(result.couponId).toEqual(userCouponId);
        expect(result.orderItems[0].productId).toEqual(orderRequestDto.products[0].productId);
        expect(result.orderItems[1].productId).toEqual(orderRequestDto.products[1].productId);
        expect(result.status).toEqual(OrderStatus.PENDING);
    });

    it('SUCCESS_쿠폰을 사용하지 않은 경우 주문이 정상적으로 완료되어야 합니다.', async () => {
        const userId = orderMockData.user.id;
        const userCouponId = null;

        const orderRequestDto: OrderRequestDto = {
            userId,
            couponId: userCouponId,
            products: [
                { productId: 1, quantity: 1 },
                { productId: 2, quantity: 2 },
            ],
        };

        const result = await controller.createOrder(orderRequestDto);

        expect(result.userId).toEqual(userId);
        expect(result.couponId).toEqual(userCouponId);
        expect(result.orderItems[0].productId).toEqual(orderRequestDto.products[0].productId);
        expect(result.orderItems[1].productId).toEqual(orderRequestDto.products[1].productId);
        expect(result.status).toEqual(OrderStatus.PENDING);
    });
});
