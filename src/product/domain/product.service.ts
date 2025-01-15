import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY, ProductRepository } from './product.repository';
import {
    ProductResponseDto,
    SpecialProductResponseDto,
} from '../presentation/dto/product.response.dto';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { ProductWithQuantityDomain } from './product-with-quantity';
import { ErrorMessage } from '../../common/errorStatus';
import { getCurrentDate, getPastDate } from '../../common/util/date';

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    ) {}

    async getProducts(offset: number, size: number): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findProducts(offset, size);
        return products.map((product) => ProductResponseDto.from(product));
    }

    async getAvailableOrderProducts(
        products: { productId: number; quantity: number }[],
        tx?: TransactionClient,
    ): Promise<ProductWithQuantityDomain[]> {
        const productIds = products.map((v) => v.productId);

        const availableProduct = await this.productRepository.findAvailableOrderProducts(
            productIds,
            tx,
        );

        if (availableProduct.length !== productIds.length) {
            throw new BadRequestException(ErrorMessage.PRODUCT_OUT_OF_STOCK);
        }

        return availableProduct.map((product) => ProductWithQuantityDomain.from(product));
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
            throw new BadRequestException(ErrorMessage.PRODUCT_OUT_OF_STOCK);
        }

        return quantity ? true : false;
    }

    async calculateQuantityProductPrice(
        products: { productId: number; quantity: number }[],
        productsPriceInfo: ProductWithQuantityDomain[],
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

    async getSpecialProducts(): Promise<SpecialProductResponseDto[]> {
        const currentDate = getCurrentDate();
        const pastDate = getPastDate(3);

        const specialProducts = await this.productRepository.findSpecialProducts(
            pastDate,
            currentDate,
        );

        return specialProducts.map((product) => SpecialProductResponseDto.from(product));
    }
}
