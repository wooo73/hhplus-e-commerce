import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { OrderFacade } from './order.facade';

import { OrderService } from '../domain/order.service';
import { UserService } from '../../user/domain/user.service';
import { ProductService } from '../../product/domain/product.service';
import { CouponService } from '../../coupon/domain/coupon.service';

import { PrismaService } from '../../database/prisma/prisma.service';
import { TRANSACTION_MANAGER } from '../../common/transaction/transaction-client';
import { OrderRequestDto } from '../presentation/dto/order.request.dto';
import { OrderStatus } from '../../common/status';

jest.mock('../domain/order.service');
jest.mock('../../user/domain/user.service');
jest.mock('../../product/domain/product.service');
jest.mock('../../coupon/domain/coupon.service');

describe('OrderFacade', () => {
    let orderFacade: OrderFacade;
    let orderService;
    let userService;
    let couponService;
    let productService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConfigService,
                PrismaService,
                OrderFacade,
                OrderService,
                UserService,
                CouponService,
                ProductService,
                {
                    provide: TRANSACTION_MANAGER,
                    useValue: { transaction: jest.fn((cb) => cb()) },
                },
            ],
        }).compile();

        orderFacade = module.get<OrderFacade>(OrderFacade);
        orderService = module.get<OrderService>(OrderService);
        userService = module.get<UserService>(UserService);
        productService = module.get<ProductService>(ProductService);
        couponService = module.get<CouponService>(CouponService);
    });

    it('FAIL_유저의 잔액이 주문한 총 금액보다 작으면 "잔액이 부족합니다." 라는 에러를 던져야 합니다.', async () => {
        const userId = 1;
        const couponId = 0;
        const products = [
            { productId: 1, quantity: 1 },
            { productId: 2, quantity: 2 },
        ];

        //given
        const dto = plainToInstance(OrderRequestDto, { userId, couponId, products });

        const availableProduct = [
            { price: 1000, productId: 1, quantity: 1 },
            { price: 2000, productId: 2, quantity: 2 },
        ];
        productService.getAvailableOrderProducts.mockResolvedValue(availableProduct);

        const user = { userId, balance: 1000 };
        userService.getUserBalance.mockResolvedValue(user);

        const orderProductsPriceInfo = [
            { productId: 1, quantity: 1, price: 1000, totalPrice: 1_000 },
            { productId: 2, quantity: 2, price: 2000, totalPrice: 4_000 },
        ];
        productService.calculateQuantityProductPrice.mockResolvedValue(orderProductsPriceInfo);

        //then
        await expect(orderFacade.order(dto)).rejects.toThrow(
            new BadRequestException('잔액이 부족합니다.'),
        );
    });
});
