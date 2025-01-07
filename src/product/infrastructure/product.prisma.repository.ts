import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ProductRepository } from '../domain/product.repository';
import { GetProductsQueryDTO } from '../presentation/dto/product.request.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getProducts(query: GetProductsQueryDTO): Promise<Product[]> {
        return await this.prisma.product.findMany({
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
}
