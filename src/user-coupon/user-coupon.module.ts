import { Module } from '@nestjs/common';
import { UserCouponService } from './application/user-coupon.service';
import { UserCouponController } from './interface/user-coupon.controller';

@Module({
    controllers: [UserCouponController],
    providers: [UserCouponService],
})
export class UserCouponModule {}
