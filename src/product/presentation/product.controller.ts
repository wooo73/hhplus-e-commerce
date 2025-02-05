import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProductsQueryDTO } from './dto/product.request.dto';
import { ProductResponseDto, SpecialProductResponseDto } from './dto/product.response.dto';
import { ProductService } from '../domain/product.service';

@Controller('product')
@ApiTags('Product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @ApiOperation({
        summary: '상품 목록 조회',
        description: '상품 목록을 조회합니다.',
    })
    @ApiOkResponse({
        description: '상품 목록',
        type: [ProductResponseDto],
    })
    async getProducts(@Query() query: GetProductsQueryDTO) {
        return await this.productService.getProducts(query.offset, query.size);
    }

    @Get('/special')
    @ApiOperation({
        summary: '상위 상품 목록 조회',
        description: '최근 3일 기준 많이 팔린 상위 상품 목록을 조회합니다.',
    })
    @ApiOkResponse({
        description: '상위 상품 목록',
        type: [SpecialProductResponseDto],
    })
    async getPopularProducts() {
        return await this.productService.getPopularProducts();
    }
}
