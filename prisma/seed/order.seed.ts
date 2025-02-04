import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/database/prisma/prisma.service';

const configService = new ConfigService();
const prisma = new PrismaService(configService);

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

export const findOrderList = async () => {
    const orderList = await prisma.order.findMany({
        include: {
            orderItem: true,
        },
    });
    return orderList;
};

export const getOrderList = async () => {
    const orderList = await prisma.order.findMany();
    return orderList;
};
