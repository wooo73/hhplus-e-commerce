import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../domain/product.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductResponseDto } from './dto/product.response.dto';

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
    async getProducts() {
        return [
            {
                id: 1,
                name: '상품1',
                price: 10_000,
            },
        ];
    }

    @Get('/special')
    @ApiOperation({
        summary: '상위 상품 목록 조회',
        description: '최근 3일 기준 많이 팔린 상위 상품 목록을 조회합니다.',
    })
    @ApiOkResponse({
        description: '상위 상품 목록',
        type: [ProductResponseDto],
    })
    async getSpecialProducts() {
        return [
            {
                id: 1,
                name: '상품1',
                price: 10_000,
            },
        ];
    }
}
