import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { PaymentController } from './payment.controller';

import { PaymentFacade } from '../application/payment.facade';

import { PaymentService } from '../domain/payment.service';
import { OrderService } from '../../order/domain/order.service';
import { UserService } from '../../user/domain/user.service';
import { CouponService } from '../../coupon/domain/coupon.service';
import { ProductService } from '../../product/domain/product.service';

import { PrismaService } from '../../database/prisma/prisma.service';
import { RedisModule } from '../../database/redis/redis.module';
import { RedisService } from '../../database/redis/redis.service';

import { ORDER_REPOSITORY } from '../../order/domain/order.repository';
import { OrderPrismaRepository } from '../../order/infrastructure/order.prisma.repository';
import { USER_REPOSITORY } from '../../user/domain/user.repository';
import { UserPrismaRepository } from '../../user/infrastructure/user.prisma.repository';
import { COUPON_REPOSITORY } from '../../coupon/domain/coupon.repository';
import { CouponPrismaRepository } from '../../coupon/infrastructure/coupon.prisma.repository';
import { PRODUCT_REPOSITORY } from '../../product/domain/product.repository';
import { ProductPrismaRepository } from '../../product/infrastructure/product.prisma.repository';
import { TRANSACTION_MANAGER } from '../../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../../common/transaction/prisma.transaction-client';

import { OrderStatus } from '../../common/status';

import { createMockUser } from '../../../prisma/seed/user.seed';
import { createMockOrder } from '../../../prisma/seed/order.seed';
import { createMockProduct } from '../../../prisma/seed/product.seed';

describe('PaymentController', () => {
    let paymentController: PaymentController;
    let userService: UserService;
    let redisService: RedisService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [RedisModule],
            controllers: [PaymentController],
            providers: [
                PrismaService,
                ConfigService,
                PaymentService,
                PaymentFacade,
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

        paymentController = module.get<PaymentController>(PaymentController);
        userService = module.get<UserService>(UserService);
        redisService = module.get<RedisService>(RedisService);
    });

    afterEach(async () => {
        await redisService.quit();
    });

    it('동시에 중복 결제 요청이 올 경우 유저의 잔액은 한번만 차감되어야 한다.', async () => {
        const balance = 50000;
        const user = await createMockUser(balance);

        const price = 1000;
        const remainingQuantity = 10;
        const mockOrderProduct = await createMockProduct(price, remainingQuantity);

        const orderData = {
            userId: user.id,
            couponId: null,
            totalAmount: price,
            discountAmount: 0,
            finalAmount: price,
            status: OrderStatus.PENDING,
        };

        const orderItemData = {
            productId: mockOrderProduct.id,
            quantity: 1,
            price: mockOrderProduct.price,
        };

        const { order, orderItem } = await createMockOrder(orderData, orderItemData);

        const count = 30;

        const paymentPromise = Array.from({ length: count }, () =>
            paymentController.createPayment({ orderId: order.id, userId: user.id }),
        );

        const result = await Promise.allSettled(paymentPromise);

        const fulfilled = result.filter((r) => r.status === 'fulfilled');
        const rejected = result.filter((r) => r.status === 'rejected');

        expect(fulfilled.length).toEqual(count - 29);
        expect(rejected.length).toEqual(count - 1);

        const afterUserBalance = await userService.getUserBalance(user.id);

        expect(afterUserBalance.balance).toEqual(user.balance - orderItem.price);
    });

    describe('결제 요청 잠금 통합 테스트(중복 100번 동시 주문 요청)', () => {
        const balance = 1_000_000;
        const price = 1000;
        const remainingQuantity = 10;

        const count = 100;

        it('낙관적락', async () => {
            const user = await createMockUser(balance);
            const mockOrderProduct = await createMockProduct(price, remainingQuantity);

            const orderData = {
                userId: user.id,
                couponId: null,
                totalAmount: price,
                discountAmount: 0,
                finalAmount: price,
                status: OrderStatus.PENDING,
            };

            const orderItemData = {
                productId: mockOrderProduct.id,
                quantity: 1,
                price: mockOrderProduct.price,
            };

            const { order, orderItem } = await createMockOrder(orderData, orderItemData);

            const paymentPromise = Array.from({ length: count }, () =>
                paymentController.createPayment({ orderId: order.id, userId: user.id }),
            );

            const result = await Promise.allSettled(paymentPromise);

            const fulfilled = result.filter((r) => r.status === 'fulfilled');
            const rejected = result.filter((r) => r.status === 'rejected');

            expect(fulfilled.length).toEqual(count - 99);
            expect(rejected.length).toEqual(count - 1);

            const afterUserBalance = await userService.getUserBalance(user.id);

            expect(afterUserBalance.balance).toEqual(user.balance - orderItem.price);
        });

        it('분산락', async () => {
            const user = await createMockUser(balance);
            const mockOrderProduct = await createMockProduct(price, remainingQuantity);

            const orderData = {
                userId: user.id,
                couponId: null,
                totalAmount: price,
                discountAmount: 0,
                finalAmount: price,
                status: OrderStatus.PENDING,
            };

            const orderItemData = {
                productId: mockOrderProduct.id,
                quantity: 1,
                price: mockOrderProduct.price,
            };

            const { order, orderItem } = await createMockOrder(orderData, orderItemData);

            const paymentPromise = Array.from({ length: count }, () =>
                paymentController.createPaymentWithRedis({ orderId: order.id, userId: user.id }),
            );

            const result = await Promise.allSettled(paymentPromise);

            const fulfilled = result.filter((r) => r.status === 'fulfilled');
            const rejected = result.filter((r) => r.status === 'rejected');

            expect(fulfilled.length).toEqual(count - 99);
            expect(rejected.length).toEqual(count - 1);

            const afterUserBalance = await userService.getUserBalance(user.id);

            expect(afterUserBalance.balance).toEqual(user.balance - orderItem.price);
        });
    });
});
