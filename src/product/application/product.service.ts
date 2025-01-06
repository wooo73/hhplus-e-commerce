import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY, ProductRepository } from './product.repository';
import { GetProductsQueryDTO } from '../presentation/dto/product.request.dto';
import { ProductResponseDto } from '../presentation/dto/product.response.dto';

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    ) {}

    async getProducts(query: GetProductsQueryDTO): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.getProducts(query);
        return products.map((product) => ProductResponseDto.of(product));
    }
}
