import { OmitType, PickType } from '@nestjs/swagger';
import { Coupon } from '../domain/coupon';
import { UserCoupon } from '../domain/userCoupon';

export class AvailableCouponResponseDto extends PickType(Coupon, [
    'id',
    'name',
    'discountType',
    'discountValue',
] as const) {}

export class UserCouponResponseDto extends OmitType(UserCoupon, [
    'createdAt',
    'updatedAt',
] as const) {}
