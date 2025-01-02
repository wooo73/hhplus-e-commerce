import { Module } from '@nestjs/common';
import { ProductService } from './application/product.service';
import { ProductController } from './interface/product.controller';

@Module({
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
