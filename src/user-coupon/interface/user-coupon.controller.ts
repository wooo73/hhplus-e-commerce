import { Controller } from '@nestjs/common';
import { UserCouponService } from '../application/user-coupon.service';

@Controller('user-coupon')
export class UserCouponController {
    constructor(private readonly userCouponService: UserCouponService) {}
}
