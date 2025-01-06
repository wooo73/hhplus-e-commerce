import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from '../application/product.service';
import { ApiTags } from '@nestjs/swagger';
import { getProductsSwagger, getSpecialProductsSwagger } from '../swagger/product.swagger';
import { GetProductsQueryDTO } from './dto/product.request.dto';

@Controller('product')
@ApiTags('Product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @getProductsSwagger()
    async getProducts(@Query() query: GetProductsQueryDTO) {
        return await this.productService.getProducts(query);
    }

    @Get('/special')
    @getSpecialProductsSwagger()
    async getSpecialProducts(@Query() query: GetProductsQueryDTO) {
        return [
            {
                id: 1,
                name: '상품1',
                price: 10_000,
            },
        ];
    }
}
