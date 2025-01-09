import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY, ProductRepository } from './product.repository';
import { GetProductsQueryDTO } from '../presentation/dto/product.request.dto';
import { ProductResponseDto } from '../presentation/dto/product.response.dto';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { ProductEntity } from './product';
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

    async validateProductRemainingQuantityWithLock(
        productId: number,
        orderQuantity: number,
        tx?: TransactionClient,
    ): Promise<boolean> {
        const quantity = await this.productRepository.findOrderProductRemainingQuantityWithLock(
            productId,
            orderQuantity,
            tx,
        );

        if (!quantity) {
            throw new BadRequestException('상품 재고가 부족합니다.');
        }

        return quantity ? true : false;
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

    async decreaseProductRemainingQuantity(
        productId: number,
        orderQuantity: number,
        tx?: TransactionClient,
    ): Promise<void> {
        await this.productRepository.decreaseProductRemainingQuantity(productId, orderQuantity, tx);
    }
}
