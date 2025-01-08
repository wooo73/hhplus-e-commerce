import { Coupon, UserCoupon } from '@prisma/client';
import { CouponEntity } from '../../domain/coupon';
import { UserCouponEntity } from '../../domain/userCoupon';

export class UserCouponResponseDto extends UserCouponEntity {
    constructor(userCoupon: UserCoupon) {
        super();
        Object.assign(this, userCoupon);
    }

    static of(userCoupon: UserCoupon) {
        return new UserCouponResponseDto(userCoupon);
    }
}

export class AvailableCouponResponseDto extends CouponEntity {
    constructor(coupon: Coupon) {
        super();
        Object.assign(this, coupon);
    }

    static of(coupon: Coupon) {
        return new AvailableCouponResponseDto(coupon);
    }
}
