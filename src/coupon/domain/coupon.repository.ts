import { Coupon, CouponQuantity, Prisma, UserCoupon } from '@prisma/client';

export interface CouponRepository {
    getUserOwnedCouponIds(
        userId: number,
        tx?: Prisma.TransactionClient,
    ): Promise<{ couponId: number }[]>;
    getAvailableCoupons(
        couponIds: number[],
        nowDate: Date,
        tx?: Prisma.TransactionClient,
    ): Promise<Coupon[]>;
    couponValidCheck(
        couponId: number,
        userId: number,
        nowDate: Date,
        tx?: Prisma.TransactionClient,
    ): Promise<boolean>;
    couponQuantityValidCheckWithLock(
        couponId: number,
        tx?: Prisma.TransactionClient,
    ): Promise<boolean>;
    insertUserCoupon(
        couponId: number,
        userId: number,
        tx?: Prisma.TransactionClient,
    ): Promise<UserCoupon>;
    decrementCouponQuantity(
        couponId: number,
        tx?: Prisma.TransactionClient,
    ): Promise<CouponQuantity>;
    getUserOwnedCoupons(
        userId: number,
        { take, skip }: { take: number; skip: number },
        tx?: Prisma.TransactionClient,
    ): Promise<UserCoupon[]>;
}

export const COUPON_REPOSITORY = Symbol('COUPON_REPOSITORY');
