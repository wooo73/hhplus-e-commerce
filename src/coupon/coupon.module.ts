import { Module } from '@nestjs/common';
import { CouponService } from './domain/coupon.service';
import { CouponController } from './presentation/coupon.controller';

@Module({
    controllers: [CouponController],
    providers: [CouponService],
})
export class CouponModule {}
