import { PrismaService } from 'src/database/prisma/prisma.service';
import { GetProductsQueryDTO } from '../presentation/dto/product.request.dto';
import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../application/product.repository';
import { Product } from '../domain/product';

@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getProducts(query: GetProductsQueryDTO): Promise<Product[]> {
        return await this.prisma.product.findMany({
            include: {
                ProductQuantity: true,
            },
            skip: query.offset,
            take: query.size,
        });
    }
}
