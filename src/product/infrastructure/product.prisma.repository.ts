import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ProductRepository } from '../domain/product.repository';
import { GetProductsQueryDTO } from '../presentation/dto/product.request.dto';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { ProductEntity } from '../domain/product';
import { OrderProductRemainingQuantity } from './types/product-quantity';
import { GetOrderProducts, specialProducts } from './types/product';
import { ProductStatus } from '../../common/status';
import { ProductQuantityEntity } from '../domain/product-quantity';

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
        productId: number,
        orderQuantity: number,
        tx?: TransactionClient,
    ): Promise<OrderProductRemainingQuantity[]> {
        const client = this.getClient(tx);

        const quantity =
            await client.$queryRaw`SELECT * FROM product_quantity WHERE product_id = ${productId} AND remaining_quantity <> 0 AND remaining_quantity >= ${orderQuantity}  FOR UPDATE`;

        return quantity[0];
    }

    async decreaseProductRemainingQuantity(
        productId: number,
        orderQuantity: number,
        tx?: TransactionClient,
    ): Promise<ProductQuantityEntity> {
        const client = this.getClient(tx);

        return await client.productQuantity.update({
            where: { productId },
            data: { remainingQuantity: { decrement: orderQuantity } },
        });
    }

    async getSpecialProducts(
        startDate: string,
        endDate: string,
        tx?: TransactionClient,
    ): Promise<specialProducts[]> {
        const client = this.getClient(tx);

        const result = await client.$queryRaw<[specialProducts]>`
            SELECT
                 p.id AS productId,
                 p.name AS name,
                 p.price AS price,
                 p.status AS status,
                 SUM(oi.quantity) AS orderQuantity
            FROM order_item oi
            JOIN product p ON oi.product_id = p.id
            WHERE oi.created_at >= ${startDate}
            AND oi.created_at <= ${endDate}
            GROUP BY oi.product_id 
            ORDER BY SUM(oi.quantity)
            DESC LIMIT 5
        `;

        return result;
    }
}
