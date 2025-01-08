import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CouponRepository } from '../domain/coupon.repository';
import { CouponStatus } from '../../common/status';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { CouponEntity } from '../domain/coupon';
import { UserCouponEntity } from '../domain/userCoupon';
import { CouponQuantityEntity } from '../domain/coupon-quantity';

@Injectable()
export class CouponPrismaRepository implements CouponRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: TransactionClient) {
        return tx ? tx.prisma : this.prisma;
    }

    async getUserOwnedCouponIds(
        userId: number,
        tx?: TransactionClient,
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
        tx?: TransactionClient,
    ): Promise<CouponEntity[]> {
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
        tx?: TransactionClient,
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
        tx: TransactionClient,
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
        tx?: TransactionClient,
    ): Promise<UserCouponEntity> {
        const client = this.getClient(tx);

        return await client.userCoupon.create({
            data: { couponId, userId },
        });
    }

    async decrementCouponQuantity(
        couponId: number,
        tx?: TransactionClient,
    ): Promise<CouponQuantityEntity> {
        const client = this.getClient(tx);

        return await client.couponQuantity.update({
            where: { couponId },
            data: { remainingQuantity: { decrement: 1 } },
        });
    }

    async getUserOwnedCoupons(
        userId: number,
        { take, skip }: { take: number; skip: number },
        tx?: TransactionClient,
    ): Promise<UserCouponEntity[]> {
        const client = this.getClient(tx);
        console.log(take, skip);
        return await client.userCoupon.findMany({
            where: { userId },
            take,
            skip,
        });
    }
}
