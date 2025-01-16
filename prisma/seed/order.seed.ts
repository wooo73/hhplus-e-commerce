import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createMockOrder = async (
    { userId, couponId, totalAmount, discountAmount, finalAmount, status },
    { productId, quantity, price },
) => {
    const order = await prisma.order.create({
        data: {
            userId,
            couponId,
            totalAmount,
            discountAmount,
            finalAmount,
            status,
        },
    });

    const orderItem = await prisma.orderItem.create({
        data: { orderId: order.id, productId, quantity, price },
    });

    return { order, orderItem };
};
