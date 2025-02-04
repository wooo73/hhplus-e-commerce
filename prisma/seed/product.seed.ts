import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/database/prisma/prisma.service';

const configService = new ConfigService();
const prisma = new PrismaService(configService);

export const createMockProduct = async (price: number, remainingQuantity: number) => {
    const product = await prisma.product.create({
        data: {
            name: `테스트상품`,
            price,
            productQuantity: {
                create: {
                    quantity: 10,
                    remainingQuantity,
                },
            },
        },
    });
    return product;
};

export const getProductQuantity = async (productId: number) => {
    const productQuantity = await prisma.productQuantity.findUnique({
        where: { productId },
    });
    return productQuantity;
};
