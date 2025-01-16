import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createMockCoupon = async (
    status: string,
    discountType: string,
    discountValue: number,
    remainingQuantity: number,
) => {
    const coupon = await prisma.coupon.create({
        data: {
            name: `coupon_test`,
            status: status,
            discountType: discountType,
            discountValue: discountValue,
            startAt: new Date(),
            endAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
            couponQuantity: {
                create: {
                    quantity: 10,
                    remainingQuantity,
                },
            },
        },
    });

    return coupon;
};
