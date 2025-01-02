import { Controller } from '@nestjs/common';
import { CouponService } from '../application/coupon.service';

@Controller('coupon')
export class CouponController {
    constructor(private readonly couponService: CouponService) {}
}
