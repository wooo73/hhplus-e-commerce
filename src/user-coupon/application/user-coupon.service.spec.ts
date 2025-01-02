import { Test, TestingModule } from '@nestjs/testing';
import { UserCouponService } from '../user-coupon/user-coupon.service';

describe('UserCouponService', () => {
    let service: UserCouponService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserCouponService],
        }).compile();

        service = module.get<UserCouponService>(UserCouponService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
