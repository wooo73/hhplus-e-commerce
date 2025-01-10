import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from '../domain/payment.service';
import { PaymentFacade } from '../application/payment.pacade';
import { OrderService } from '../../order/domain/order.service';
import { UserService } from '../../user/domain/user.service';
import { CouponService } from '../../coupon/domain/coupon.service';
import { ProductService } from '../../product/domain/product.service';
import { ORDER_REPOSITORY } from '../../order/domain/order.repository';
import { OrderPrismaRepository } from '../../order/infrastructure/order.prisma.repository';
import { UserPrismaRepository } from '../../user/infrastructure/user.prisma.repository';
import { USER_REPOSITORY } from '../../user/domain/user.repository';
import { CouponPrismaRepository } from '../../coupon/infrastructure/coupon.prisma.repository';
import { COUPON_REPOSITORY } from '../../coupon/domain/coupon.repository';
import { ProductPrismaRepository } from '../../product/infrastructure/product.prisma.repository';
import { PRODUCT_REPOSITORY } from '../../product/domain/product.repository';
import { PrismaTransactionManager } from '../../common/transaction/prisma.transaction-client';
import { TRANSACTION_MANAGER } from '../../common/transaction/transaction-client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { getPrismaClient } from '../../../test/it/util';
import { createMockOrderData } from '../../order/presentation/order.controller.it.spec';
import { UserEntity } from '../../user/domain/user';
import { CouponEntity } from '../../coupon/domain/coupon';
import { UserCouponEntity } from '../../coupon/domain/userCoupon';
import { CouponQuantityEntity } from '../../coupon/domain/coupon-quantity';
import { OrderStatus } from '../../common/status';

let prisma: PrismaClient;

const createMockPaymentData = async () => {
    prisma = await getPrismaClient();

    const orderMockData: {
        user: UserEntity;
        coupon: CouponEntity;
        userCoupon: UserCouponEntity;
        couponQuantity: CouponQuantityEntity;
    } = await createMockOrderData();

    const orderProduct = await prisma.product.create({
        data: {
            name: `payment_test_product`,
            price: 1000,
            productQuantity: {
                create: {
                    quantity: 10,
                    remainingQuantity: 3,
                },
            },
        },
    });

    const orderObj = {
        userId: orderMockData.user.id,
        couponId: null,
        totalAmount: 1000,
        discountAmount: 0,
        finalAmount: 1000,
        status: OrderStatus.PENDING,
    };

    const order = await prisma.order.create({
        data: orderObj,
    });

    const orderItemObj = {
        orderId: order.id,
        productId: orderProduct.id,
        quantity: 1,
        price: orderProduct.price,
    };

    const orderItem = await prisma.orderItem.create({
        data: orderItemObj,
    });

    return { user: orderMockData.user, order, orderItem };
};

describe('PaymentController', () => {
    let paymentController: PaymentController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
    });

    it('SUCCESS_상품의 잔여 재고가 3개 남아있을때 동시에 결제 요청이 10번이 오면 3개만 결제되어야 한다.', async () => {
        const { user, order } = await createMockPaymentData();
        const count = 10;

        const paymentPromise = Array.from({ length: count }, (_, index) =>
            paymentController.createPayment({ orderId: order.id, userId: user.id }),
        );

        const result = await Promise.allSettled(paymentPromise);

        const rejectedResult = result.filter((v) => v.status === 'rejected');
        const fulfilledResult = result.filter((v) => v.status === 'fulfilled');

        expect(rejectedResult.length).toEqual(7);
        expect(fulfilledResult.length).toEqual(3);
    });

    it('SUCCESS_동시에 결제 요청이 올 경우 유저의 잔액은 순차적으로 차감되어야 한다.', async () => {
        const { user, order, orderItem } = await createMockPaymentData();

        await prisma.productQuantity.update({
            where: { productId: orderItem.productId },
            data: { remainingQuantity: 10 },
        });

        const count = 7;

        const paymentPromise = Array.from({ length: count }, () =>
            paymentController.createPayment({ orderId: order.id, userId: user.id }),
        );

        await Promise.all(paymentPromise);

        const afterUserBalance = await prisma.user.findUnique({ where: { id: user.id } });

        expect(afterUserBalance.balance).toEqual(user.balance - orderItem.price * count);
    });
});
