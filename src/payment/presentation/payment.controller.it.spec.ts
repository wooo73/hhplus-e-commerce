import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { PaymentController } from './payment.controller';

import { UserService } from '../../user/domain/user.service';

import { RedisModule } from '../../database/redis/redis.module';
import { RedlockService } from '../../database/redis/redlock.service';

import { TRANSACTION_MANAGER } from '../../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../../common/transaction/prisma.transaction-client';

import { OrderStatus } from '../../common/status';

import { createMockUser } from '../../../prisma/seed/user.seed';
import { createMockOrder } from '../../../prisma/seed/order.seed';
import { createMockProduct } from '../../../prisma/seed/product.seed';
import { OrderModule } from '../../order/order.module';
import { UserModule } from '../../user/user.module';
import { CouponModule } from '../../coupon/coupon.module';
import { ProductModule } from '../../product/product.module';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { PaymentModule } from '../payment.module';

describe('PaymentController', () => {
    let paymentController: PaymentController;
    let userService: UserService;
    let redlockService: RedlockService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PrismaModule,
                RedisModule,
                PaymentModule,
                OrderModule,
                UserModule,
                CouponModule,
                ProductModule,
            ],
            controllers: [PaymentController],
            providers: [
                ConfigService,
                { provide: TRANSACTION_MANAGER, useClass: PrismaTransactionManager },
            ],
        }).compile();

        paymentController = module.get<PaymentController>(PaymentController);
        userService = module.get<UserService>(UserService);
        redlockService = module.get<RedlockService>(RedlockService);
    });

    afterEach(async () => {
        await redlockService.quit();
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
