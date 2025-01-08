import { Injectable } from '@nestjs/common';
import { Coupon, CouponQuantity, Prisma, PrismaClient, UserCoupon } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CouponRepository } from '../domain/coupon.repository';
import { CouponStatus } from '../../common/coupon.status';

@Injectable()
export class CouponPrismaRepository implements CouponRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ? tx : this.prisma;
    }

    async getUserOwnedCouponIds(
        userId: number,
        tx?: Prisma.TransactionClient,
    ): Promise<{ couponId: number }[]> {
        const client = this.getClient(tx);

        return await client.userCoupon.findMany({
            where: { userId },
            select: { couponId: true },
        });
    }

    async getAvailableCoupons(
        couponIds: number[],
        nowDate: Date,
        tx?: Prisma.TransactionClient,
    ): Promise<Coupon[]> {
        const client = this.getClient(tx);

        return await client.coupon.findMany({
            where: {
                id: { notIn: couponIds },
                status: CouponStatus.AVAILABLE,
                endAt: { gte: nowDate },
            },
        });
    }

    async couponValidCheck(
        couponId: number,
        userId: number,
        nowDate: Date,
        tx?: Prisma.TransactionClient,
    ): Promise<boolean> {
        const client = this.getClient(tx);

        const coupon = await client.coupon.findUnique({
            where: {
                id: couponId,
                status: CouponStatus.AVAILABLE,
                endAt: { gte: nowDate },
                userCoupon: { none: { couponId: couponId, userId: userId } },
            },
        });

        return coupon ? true : false;
    }

    async couponQuantityValidCheckWithLock(
        couponId: number,
        tx: Prisma.TransactionClient,
    ): Promise<boolean> {
        const client = this.getClient(tx);

        const couponQuantity = await client.$queryRaw<
            { remaining_quantity: number }[]
        >`SELECT remaining_quantity FROM coupon_quantity WHERE coupon_id = ${couponId} FOR UPDATE`;

        const remainingQuantity = couponQuantity[0]?.remaining_quantity;

        return !remainingQuantity ? false : remainingQuantity <= 0 ? false : true;
    }

    async insertUserCoupon(
        couponId: number,
        userId: number,
        tx?: Prisma.TransactionClient,
    ): Promise<UserCoupon> {
        const client = this.getClient(tx);

        return await client.userCoupon.create({
            data: { couponId, userId },
        });
    }

    async decrementCouponQuantity(
        couponId: number,
        tx?: Prisma.TransactionClient,
    ): Promise<CouponQuantity> {
        const client = this.getClient(tx);

        return await client.couponQuantity.update({
            where: { couponId },
            data: { remainingQuantity: { decrement: 1 } },
        });
    }
}
