import { TransactionClient } from '../../common/transaction/transaction-client';
import { CouponDomain } from './coupon';
import { UserCouponDomain } from './userCoupon';
import { CouponQuantityDomain } from './coupon-quantity';

export interface CouponRepository {
    getUserOwnedCouponIds(userId: number, tx?: TransactionClient): Promise<{ couponId: number }[]>;
    getAvailableCoupons(
        couponIds: number[],
        nowDate: string,
        tx?: TransactionClient,
    ): Promise<CouponDomain[]>;
    couponValidCheck(
        couponId: number,
        userId: number,
        nowDate: string,
        tx?: TransactionClient,
    ): Promise<boolean>;
    couponQuantityValidCheckWithLock(couponId: number, tx: TransactionClient): Promise<boolean>;
    insertUserCoupon(
        couponId: number,
        userId: number,
        tx?: TransactionClient,
    ): Promise<UserCouponDomain>;
    decrementCouponQuantity(
        couponId: number,
        tx?: TransactionClient,
    ): Promise<CouponQuantityDomain>;
    getUserOwnedCoupons(
        userId: number,
        take: number,
        skip: number,
        tx?: TransactionClient,
    ): Promise<UserCouponDomain[]>;
    findByUserCouponIdWithLock(
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
    }>;
    findByUserCouponId(
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
    }>;
    updateCouponStatus(userCouponId: number, userId: number, tx?: TransactionClient): Promise<void>;
}

export const COUPON_REPOSITORY = Symbol('COUPON_REPOSITORY');
