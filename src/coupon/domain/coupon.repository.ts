import { TransactionClient } from 'src/common/transaction/transaction-client';
import { CouponEntity } from './coupon';
import { UserCouponEntity } from './userCoupon';
import { CouponQuantityEntity } from './coupon-quantity';

export interface CouponRepository {
    getUserOwnedCouponIds(userId: number, tx?: TransactionClient): Promise<{ couponId: number }[]>;
    getAvailableCoupons(
        couponIds: number[],
        nowDate: Date,
        tx?: TransactionClient,
    ): Promise<CouponEntity[]>;
    couponValidCheck(
        couponId: number,
        userId: number,
        nowDate: Date,
        tx?: TransactionClient,
    ): Promise<boolean>;
    couponQuantityValidCheckWithLock(couponId: number, tx: TransactionClient): Promise<boolean>;
    insertUserCoupon(
        couponId: number,
        userId: number,
        tx?: TransactionClient,
    ): Promise<UserCouponEntity>;
    decrementCouponQuantity(
        couponId: number,
        tx?: TransactionClient,
    ): Promise<CouponQuantityEntity>;
    getUserOwnedCoupons(
        userId: number,
        { take, skip }: { take: number; skip: number },
        tx?: TransactionClient,
    ): Promise<UserCouponEntity[]>;
}

export const COUPON_REPOSITORY = Symbol('COUPON_REPOSITORY');
