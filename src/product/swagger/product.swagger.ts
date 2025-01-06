import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ProductResponseDto } from '../presentation/dto/product.response.dto';

export function getProductsSwagger() {
    return applyDecorators(
        ApiOperation({ summary: '상품 목록 조회', description: '상품 목록을 조회합니다.' }),
        ApiOkResponse({ description: '상품 목록', type: [ProductResponseDto] }),
    );
}

export function getSpecialProductsSwagger() {
    return applyDecorators(
        ApiOperation({
            summary: '상위 상품 목록 조회',
            description: '최근 3일 기준 많이 팔린 상위 상품 목록을 조회합니다.',
        }),
        ApiOkResponse({ description: '상위 상품 목록', type: [ProductResponseDto] }),
    );
}
