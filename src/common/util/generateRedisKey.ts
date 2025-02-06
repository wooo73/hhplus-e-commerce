import { CouponRedisKey } from '../redisKey';

export const generateCouponKey = (couponId: number) => `${CouponRedisKey.COUPON}${couponId}`;
export const generateIssueCouponKey = (couponId: number) => `${CouponRedisKey.ISSUE}${couponId}`;
export const generateRequestIssueCouponKey = (couponId: number) =>
    `${CouponRedisKey.REQUEST_QUEUE}${couponId}`;
