import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ProductController } from './product.controller';
import { ProductService } from '../domain/product.service';
import { PRODUCT_REPOSITORY } from '../domain/product.repository';
import { ProductPrismaRepository } from '../infrastructure/product.prisma.repository';
import { GetProductsQueryDTO } from './dto/product.request.dto';

describe('ProductController', () => {
    let controller: ProductController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                ConfigService,
                PrismaService,
                ProductService,
                { provide: PRODUCT_REPOSITORY, useClass: ProductPrismaRepository },
            ],
        }).compile();

        controller = module.get<ProductController>(ProductController);
    });

    it.each([
        { query: { page: -1, size: -1 }, expectedErrors: 2 },
        { query: { page: 0, size: 0 }, expectedErrors: 2 },
        { query: { page: null, size: undefined }, expectedErrors: 2 },
        { query: { page: 'aaa', size: 'aaa' }, expectedErrors: 2 },
    ])(
        'FAIL_페이지 번호와 페이지 크기값이 $query일때 $expectedErrors개의 에러가 발생합니다.',
        async ({ query, expectedErrors }) => {
            const dto = plainToClass(GetProductsQueryDTO, query);
            const error = validateSync(dto);
            expect(error).toHaveLength(expectedErrors);
        },
    );
});
