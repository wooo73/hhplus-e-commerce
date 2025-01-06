import { Module } from '@nestjs/common';
import { ProductService } from './application/product.service';
import { ProductController } from './presentation/product.controller';
import { PRODUCT_REPOSITORY } from './application/product.repository';
import { ProductTypeOrmRepository } from './infrastructure/product.typeorm.repository';

@Module({
    controllers: [ProductController],
    providers: [
        ProductService,
        { provide: PRODUCT_REPOSITORY, useClass: ProductTypeOrmRepository },
    ],
})
export class ProductModule {}
