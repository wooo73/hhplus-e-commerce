import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CouponRepository } from '../domain/coupon.repository';
import { CouponStatus } from '../../common/status';
import { TransactionClient } from '../../common/transaction/transaction-client';
import { CouponDomain } from '../domain/coupon';
import { UserCouponDomain } from '../domain/userCoupon';
import { CouponQuantityDomain } from '../domain/coupon-quantity';

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
        nowDate: string,
        tx?: TransactionClient,
    ): Promise<CouponDomain[]> {
        const client = this.getClient(tx);

        const coupons = await client.coupon.findMany({
            where: {
                id: { notIn: couponIds },
                status: CouponStatus.AVAILABLE,
                endAt: { gte: new Date(nowDate) },
            },
        });

        return coupons.map((coupon) => CouponDomain.from(coupon));
    }

    async couponValidCheck(
        couponId: number,
        userId: number,
        nowDate: string,
        tx?: TransactionClient,
    ): Promise<boolean> {
        const client = this.getClient(tx);

        const coupon = await client.coupon.findUnique({
            where: {
                id: couponId,
                status: CouponStatus.AVAILABLE,
                endAt: { gte: new Date(nowDate) },
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
    ): Promise<UserCouponDomain> {
        const client = this.getClient(tx);

        const userCoupon = await client.userCoupon.create({
            data: { couponId, userId },
        });

        return UserCouponDomain.from(userCoupon);
    }

    async decrementCouponQuantity(
        couponId: number,
        tx?: TransactionClient,
    ): Promise<CouponQuantityDomain> {
        const client = this.getClient(tx);

        const couponQuantity = await client.couponQuantity.update({
            where: { couponId },
            data: { remainingQuantity: { decrement: 1 } },
        });

        return CouponQuantityDomain.from(couponQuantity);
    }

    async getUserOwnedCoupons(
        userId: number,
        take: number,
        skip: number,
        tx?: TransactionClient,
    ): Promise<UserCouponDomain[]> {
        const client = this.getClient(tx);
        const userCoupons = await client.userCoupon.findMany({
            where: { userId },
            take,
            skip,
        });

        return userCoupons.map((userCoupon) => UserCouponDomain.from(userCoupon));
    }

    async findByUserCouponIdWithLock(
        userCouponId: number,
        userId: number,
        tx?: TransactionClient,
    ): Promise<{
        userId: number;
        couponId: number;
        isUsed: boolean;
        usedAt: Date;
        discountType: string;
        discountValue: number;
    }> {
        const client = this.getClient(tx);
        const couponStatus = CouponStatus.AVAILABLE;

        //TODO: 잠금은 userCoupon 테이블만 걸어야함.
        const coupon = await client.$queryRaw`
            SELECT 
                uc.user_id AS userId,
                uc.coupon_id AS couponId,
                uc.is_used AS isUsed,
                uc.used_at AS usedAt,
                c.discount_type AS discountType,
                c.discount_value AS discountValue
            FROM user_coupon uc 
            JOIN coupon c ON uc.coupon_id = c.id
            WHERE uc.id = ${userCouponId} 
            AND uc.user_id = ${userId} 
            AND uc.is_used = FALSE
            AND uc.used_at IS NULL
            AND c.status = ${couponStatus}
            AND c.end_at >= NOW()
            FOR UPDATE
        `;

        return coupon[0];
    }

    async findByUserCouponId(
        userCouponId: number,
        userId: number,
        tx?: TransactionClient,
    ): Promise<{
        userId: number;
        couponId: number;
        isUsed: boolean;
        usedAt: Date;
        discountType: string;
        discountValue: number;
    }> {
        const client = this.getClient(tx);
        const couponStatus = CouponStatus.AVAILABLE;

        //TODO: 잠금은 userCoupon 테이블만 걸어야함.
        const coupon = await client.$queryRaw`
            SELECT 
                uc.user_id AS userId,
                uc.coupon_id AS couponId,
                uc.is_used AS isUsed,
                uc.used_at AS usedAt,
                c.discount_type AS discountType,
                c.discount_value AS discountValue
            FROM user_coupon uc 
            JOIN coupon c ON uc.coupon_id = c.id
            WHERE uc.id = ${userCouponId} 
            AND uc.user_id = ${userId} 
            AND uc.is_used = FALSE
            AND uc.used_at IS NULL
            AND c.status = ${couponStatus}
            AND c.end_at >= NOW()        
        `;

        return coupon[0];
    }

    async updateCouponStatus(
        userCouponId: number,
        userId: number,
        tx?: TransactionClient,
    ): Promise<void> {
        const client = this.getClient(tx);

        await client.userCoupon.update({
            where: { id: userCouponId, userId },
            data: { isUsed: true, usedAt: new Date() },
        });
    }
}
