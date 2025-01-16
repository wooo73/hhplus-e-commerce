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
import { createMockUser } from '../../../prisma/seed/user.seed';
import { createMockCoupon, createUserCoupon } from '../../../prisma/seed/coupon.seed';
import { createMockProduct } from '../../../prisma/seed/product.seed';

describe('OrderController', () => {
    let controller: OrderController;

    let user: UserDomain;
    let coupon: CouponDomain;
    let userCoupon: UserCouponDomain;

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

        const balance = 50000;

        user = await createMockUser(balance);
        coupon = await createMockCoupon(CouponStatus.AVAILABLE, 'PERCENT', 10, 10);
        userCoupon = await createUserCoupon(user.id, coupon.id);
    });

    it('SUCCESS_쿠폰을 사용한 경우 주문이 정상적으로 완료되어야 합니다.', async () => {
        const userId = user.id;
        const userCouponId = userCoupon.id;

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
        const userId = user.id;
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

    it('SUCCESS_1개의 주문을 1개의 쿠폰만 사용하여 동시에 5번 요청하면 1개의 주문에서만 사용되어야 합니다.', async () => {
        const orderRequestDto: OrderRequestDto = {
            userId: user.id,
            couponId: userCoupon.id,
            products: [{ productId: 1, quantity: 1 }],
        };

        const count = 5;

        const orderPromise = Array.from({ length: count }, (_, index) =>
            controller.createOrder(orderRequestDto),
        );

        const result = await Promise.allSettled(orderPromise);

        const rejectedResult = result.filter((v) => v.status === 'rejected');
        const fulfilledResult = result.filter((v) => v.status === 'fulfilled');

        expect(fulfilledResult.length).toEqual(count - 4);
        expect(rejectedResult.length).toEqual(count - 1);
    });

    it('SUCCESS_상품의 잔여 재고가 3개 남아있을때 동시에 서로 다른 유저의 주문 요청이 10번이 오면 3개의 주문만 완료되어야 합니다.', async () => {
        const count = 10;

        const productPrice = 5000;
        const remainingQuantity = 3;
        const mockProduct = await createMockProduct(productPrice, remainingQuantity);

        const balance = 10000;
        const users = await Promise.all(
            Array.from({ length: count }, () => createMockUser(balance)),
        );

        const orderPromise = Array.from({ length: count }, (_, index) =>
            controller.createOrder({
                userId: users[index].id,
                couponId: null,
                products: [{ productId: mockProduct.id, quantity: 1 }],
            }),
        );

        const result = await Promise.allSettled(orderPromise);

        const rejectedResult = result.filter((v) => v.status === 'rejected');
        const fulfilledResult = result.filter((v) => v.status === 'fulfilled');

        expect(rejectedResult.length).toEqual(7);
        expect(fulfilledResult.length).toEqual(3);
    });
});
