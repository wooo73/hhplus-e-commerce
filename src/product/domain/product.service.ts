import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY, ProductRepository } from './product.repository';
import { GetProductsQueryDTO } from '../presentation/dto/product.request.dto';
import { ProductResponseDto } from '../presentation/dto/product.response.dto';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { ProductEntity } from './product';
import { OrderProductRemainingQuantity } from '../infrastructure/types/product-quantity';
import { GetOrderProducts } from '../infrastructure/types/product';

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    ) {}

    async getProducts(query: GetProductsQueryDTO): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.getProducts(query);
        return products.map((product) => ProductResponseDto.of(product));
    }

    async getAvailableOrderProducts(
        products: { productId: number; quantity: number }[],
        tx?: TransactionClient,
    ): Promise<GetOrderProducts[]> {
        const productIds = products.map((v) => v.productId);

        const availableProduct = await this.productRepository.findAvailableOrderProducts(
            productIds,
            tx,
        );

        if (availableProduct.length !== productIds.length) {
            throw new BadRequestException('상품 재고가 부족합니다.');
        }

        return availableProduct;
    }

    async findOrderProductRemainingQuantityWithLock(
        productIds: number[],
        tx?: TransactionClient,
    ): Promise<OrderProductRemainingQuantity[]> {
        return await this.productRepository.findOrderProductRemainingQuantityWithLock(
            productIds,
            tx,
        );
    }

    async calculateQuantityProductPrice(
        products: { productId: number; quantity: number }[],
        productsPriceInfo: ProductEntity[],
    ): Promise<{ productId: number; quantity: number; price: number; totalPrice: number }[]> {
        //주문 수량에 맞는 가격 산출
        return products.map((orderProduct) => {
            const productInfo = productsPriceInfo.find(
                (productInfo) => productInfo.id === orderProduct.productId,
            );

            return {
                productId: orderProduct.productId,
                quantity: orderProduct.quantity,
                price: productInfo.price,
                totalPrice: productInfo.price * orderProduct.quantity,
            };
        });
    }
}
