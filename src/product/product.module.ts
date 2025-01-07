import { Module } from '@nestjs/common';
import { ProductService } from './domain/product.service';
import { ProductController } from './presentation/product.controller';
import { PRODUCT_REPOSITORY } from './domain/product.repository';
import { ProductTypeOrmRepository } from './infrastructure/product.prisma.repository';

@Module({
    controllers: [ProductController],
    providers: [
        ProductService,
        { provide: PRODUCT_REPOSITORY, useClass: ProductTypeOrmRepository },
    ],
})
export class ProductModule {}
