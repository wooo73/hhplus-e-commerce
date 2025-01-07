import { Inject, Injectable } from '@nestjs/common';
import { COUPON_REPOSITORY, CouponRepository } from './coupon.repository';
import { AvailableCouponResponseDto } from '../presentation/dto/coupon.response.dto';

@Injectable()
export class CouponService {
    constructor(@Inject(COUPON_REPOSITORY) private readonly couponRepository: CouponRepository) {}

    async getAvailableCoupons(userId: number): Promise<AvailableCouponResponseDto[]> {
        const userCouponIds = await this.couponRepository.getUserCouponIds(userId);
        const couponIds = userCouponIds.map((userCouponId) => userCouponId.couponId);

        const nowDate: Date = new Date(new Date().toISOString().split('T')[0]);

        const coupons = await this.couponRepository.getAvailableCoupons(couponIds, nowDate);
        return coupons.map((coupon) => AvailableCouponResponseDto.of(coupon));
    }
}
