import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { ProductService } from './product.service';
import { PRODUCT_REPOSITORY, ProductRepository } from './product.repository';
import { ProductPrismaRepository } from '../infrastructure/product.prisma.repository';
import { TRANSACTION_MANAGER } from '../../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../../common/transaction/prisma.transaction-client';
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from './product';

jest.mock('../../common/transaction/prisma.transaction-client.ts');
jest.mock('../infrastructure/product.prisma.repository');

describe('ProductService', () => {
    let service: ProductService;
    let repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: PRODUCT_REPOSITORY,
                    useClass: ProductPrismaRepository,
                },
                {
                    provide: TRANSACTION_MANAGER,
                    useClass: PrismaTransactionManager,
                },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
        repository = module.get<ProductRepository>(PRODUCT_REPOSITORY);
    });

    describe('getProducts', () => {
        it('FAIL_주문 신청한 상품과 주문 가능한 상품의 수가 다르면 "상품 재고가 부족합니다." 라는 오류를 던져야 합니다.', async () => {
            const productsIds = [
                { productId: 1, quantity: 1 },
                { productId: 2, quantity: 1 },
                { productId: 3, quantity: 1 },
            ];

            repository.findAvailableOrderProducts.mockResolvedValue([
                { productId: 2, remainingQuantity: 4 },
            ]);

            await expect(service.getAvailableOrderProducts(productsIds)).rejects.toThrow(
                new BadRequestException('상품 재고가 부족합니다.'),
            );
        });

        it('SUCCESS_주문한 상품의 주문 수량에 맞는 합산 가격이 포함된 객체를 반환해야 합니다.', async () => {
            const productsIds = [
                { productId: 1, price: 1000, quantity: 1 },
                { productId: 2, price: 2000, quantity: 2 },
                { productId: 3, price: 3000, quantity: 1 },
            ];

            const orderProductInfo = [
                { id: 1, price: 1000 },
                { id: 2, price: 2000 },
                { id: 3, price: 3000 },
            ];

            const entity = orderProductInfo.map((v) => plainToInstance(ProductEntity, v));

            const result = await service.calculateQuantityProductPrice(productsIds, entity);

            expect(result[0].totalPrice).toEqual(
                productsIds[0].quantity * orderProductInfo[0].price,
            );
            expect(result[1].totalPrice).toEqual(
                productsIds[1].quantity * orderProductInfo[1].price,
            );
            expect(result[2].totalPrice).toEqual(
                productsIds[2].quantity * orderProductInfo[2].price,
            );
        });
    });
});
