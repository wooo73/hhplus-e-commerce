import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ProductRepository } from '../domain/product.repository';
import { GetProductsQueryDTO } from '../presentation/dto/product.request.dto';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { ProductEntity } from '../domain/product';
import { Prisma } from '@prisma/client';
import { OrderProductRemainingQuantity } from './types/product-quantity';
import { GetOrderProducts } from './types/product';
import { ProductStatus } from '../../common/status';

@Injectable()
export class ProductPrismaRepository implements ProductRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: TransactionClient) {
        return tx ? tx.prisma : this.prisma;
    }

    async getProducts(
        query: GetProductsQueryDTO,
        tx?: TransactionClient,
    ): Promise<ProductEntity[]> {
        const client = this.getClient(tx);

        return await client.product.findMany({
            include: {
                productQuantity: {
                    select: {
                        quantity: true,
                        remainingQuantity: true,
                    },
                },
            },
            skip: query.offset,
            take: query.size,
        });
    }

    async findAvailableOrderProducts(
        productIds: number[],
        tx?: TransactionClient,
    ): Promise<GetOrderProducts[]> {
        const client = this.getClient(tx);

        return await client.product.findMany({
            where: { id: { in: productIds }, AND: { status: ProductStatus.IN_STOCK } },
            include: {
                productQuantity: {
                    select: {
                        productId: true,
                        remainingQuantity: true,
                    },
                },
            },
        });
    }

    async findOrderProductRemainingQuantityWithLock(
        productIds: number[],
        tx?: TransactionClient,
    ): Promise<OrderProductRemainingQuantity[]> {
        const client = this.getClient(tx);

        return await client.$queryRaw`SELECT * FROM product_quantity WHERE product_id IN (${Prisma.join(productIds)}) FOR UPDATE`;
    }
}
