import { Module } from '@nestjs/common';
import { ProductService } from './domain/product.service';
import { ProductController } from './presentation/product.controller';
import { PRODUCT_REPOSITORY } from './domain/product.repository';
import { ProductPrismaRepository } from './infrastructure/product.prisma.repository';

@Module({
    controllers: [ProductController],
    providers: [ProductService, { provide: PRODUCT_REPOSITORY, useClass: ProductPrismaRepository }],
})
export class ProductModule {}
