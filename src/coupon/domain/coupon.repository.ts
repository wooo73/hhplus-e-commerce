import { TransactionClient } from '../../common/transaction/transaction-client';
import { CouponEntity } from './coupon';
import { UserCouponEntity } from './userCoupon';
import { CouponQuantityEntity } from './coupon-quantity';
import { UserCouponToUseResponseDto } from '../presentation/dto/coupon.response.dto';

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
    findByUserCouponIdWithLock(
        userCouponId: number,
        userId: number,
        tx?: TransactionClient,
    ): Promise<UserCouponToUseResponseDto>;
    updateCouponStatus(userCouponId: number, userId: number, tx?: TransactionClient): Promise<void>;
}

export const COUPON_REPOSITORY = Symbol('COUPON_REPOSITORY');
