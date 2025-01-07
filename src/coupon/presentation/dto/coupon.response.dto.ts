import { Coupon } from '@prisma/client';
import { CouponEntity } from '../../domain/coupon';

export class UserCouponResponseDto extends CouponEntity {}

export class AvailableCouponResponseDto extends CouponEntity {
    constructor(coupon: Coupon) {
        super();
        Object.assign(this, coupon);
    }

    static of(coupon: Coupon) {
        return new AvailableCouponResponseDto(coupon);
    }
}
