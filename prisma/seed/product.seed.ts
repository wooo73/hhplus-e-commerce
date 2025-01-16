import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
