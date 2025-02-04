import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { ProductStatus } from '../../common/status';
import { ProductRepository } from '../domain/product.repository';
import { ProductWithQuantityDomain } from '../domain/product-with-quantity';
import { ProductQuantityDomain } from '../domain/product-quantity';

@Injectable()
export class ProductPrismaRepository implements ProductRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: TransactionClient) {
        return tx ? tx.prisma : this.prisma;
    }

    async findProducts(
        offset: number,
        size: number,
        tx?: TransactionClient,
    ): Promise<ProductWithQuantityDomain[]> {
        const client = this.getClient(tx);

        const products = await client.product.findMany({
            include: {
                productQuantity: {
                    select: { quantity: true, remainingQuantity: true },
                },
            },
            skip: offset,
            take: size,
        });

        return products.map((product) => ProductWithQuantityDomain.from(product));
    }

    async findAvailableOrderProducts(
        productIds: number[],
        tx?: TransactionClient,
    ): Promise<ProductWithQuantityDomain[]> {
        const client = this.getClient(tx);

        const products = await client.product.findMany({
            where: { id: { in: productIds }, AND: { status: ProductStatus.IN_STOCK } },
            include: {
                productQuantity: {
                    select: { quantity: true, remainingQuantity: true },
                },
            },
        });
        return products.map((product) => ProductWithQuantityDomain.from(product));
    }

    async findOrderProductRemainingQuantityWithLock(
        productId: number,
        orderQuantity: number,
        tx?: TransactionClient,
    ): Promise<ProductQuantityDomain> {
        const client = this.getClient(tx);

        const quantity =
            await client.$queryRaw`SELECT * FROM product_quantity WHERE product_id = ${productId} AND remaining_quantity <> 0 AND remaining_quantity >= ${orderQuantity}  FOR UPDATE`;

        return ProductQuantityDomain.from(quantity[0]);
    }

    async findOrderProductRemainingQuantity(
        productId: number,
        orderQuantity: number,
        tx?: TransactionClient,
    ): Promise<ProductQuantityDomain> {
        const client = this.getClient(tx);

        const quantity =
            await client.$queryRaw`SELECT * FROM product_quantity WHERE product_id = ${productId} AND remaining_quantity <> 0 AND remaining_quantity >= ${orderQuantity}`;

        return ProductQuantityDomain.from(quantity[0]);
    }

    async decreaseProductRemainingQuantity(
        productId: number,
        orderQuantity: number,
        tx?: TransactionClient,
    ): Promise<ProductQuantityDomain> {
        const client = this.getClient(tx);

        const quantity = await client.productQuantity.update({
            where: { productId },
            data: { remainingQuantity: { decrement: orderQuantity } },
        });

        return ProductQuantityDomain.from(quantity);
    }

    async findSpecialProducts(
        startDate: string,
        endDate: string,
        tx?: TransactionClient,
    ): Promise<
        { productId: number; name: string; price: number; status: string; orderQuantity: number }[]
    > {
        const client = this.getClient(tx);

        return await client.$queryRaw`
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
    }
}
