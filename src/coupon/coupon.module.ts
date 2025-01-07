import { Module } from '@nestjs/common';
import { CouponService } from './domain/coupon.service';
import { CouponController } from './presentation/coupon.controller';
import { COUPON_REPOSITORY } from './domain/coupon.repository';
import { CouponPrismaRepository } from './infrastructure/coupon.prisma.repository';

@Module({
    controllers: [CouponController],
    providers: [CouponService, { provide: COUPON_REPOSITORY, useClass: CouponPrismaRepository }],
})
export class CouponModule {}
