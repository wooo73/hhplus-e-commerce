import { Coupon } from '@prisma/client';

export interface CouponRepository {
    getUserCouponIds(userId: number): Promise<{ couponId: number }[]>;
    getAvailableCoupons(couponIds: number[], nowDate: Date): Promise<Coupon[]>;
}

export const COUPON_REPOSITORY = Symbol('COUPON_REPOSITORY');
