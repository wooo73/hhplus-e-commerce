import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { COUPON_REPOSITORY, CouponRepository } from './coupon.repository';
import {
    AvailableCouponResponseDto,
    UserCouponResponseDto,
} from '../presentation/dto/coupon.response.dto';
import {
    TRANSACTION_MANAGER,
    TransactionManager,
} from '../../common/transaction/transaction-client';

@Injectable()
export class CouponService {
    constructor(
        @Inject(COUPON_REPOSITORY) private readonly couponRepository: CouponRepository,
        @Inject(TRANSACTION_MANAGER) private readonly transactionManager: TransactionManager,
    ) {}

    async getAvailableCoupons(userId: number): Promise<AvailableCouponResponseDto[]> {
        // 유저가 보유한 쿠폰 ids
        const userCouponIds = await this.couponRepository.getUserOwnedCouponIds(userId);
        const couponIds = userCouponIds.map((userCouponId) => userCouponId.couponId);

        const nowDate: Date = new Date(new Date().toISOString().split('T')[0]);

        // 발급 가능 쿠폰
        const coupons = await this.couponRepository.getAvailableCoupons(couponIds, nowDate);
        return coupons.map((coupon) => AvailableCouponResponseDto.of(coupon));
    }

    async issueCoupon(couponId: number, userId: number): Promise<UserCouponResponseDto> {
        const nowDate: Date = new Date(new Date().toISOString().split('T')[0]);

        // 유효 쿠폰: 발급 가능 상태, 사용기간이 지나지 않은 쿠폰, 발급 이력 없는 쿠폰
        const isCouponValid = await this.couponRepository.couponValidCheck(
            couponId,
            userId,
            nowDate,
        );
        if (!isCouponValid) {
            throw new BadRequestException('쿠폰이 유효하지 않습니다.');
        }

        return await this.transactionManager.transaction(async (tx) => {
            // 쿠폰 재고 확인(비관적 락)
            const couponQuantity = await this.couponRepository.couponQuantityValidCheckWithLock(
                couponId,
                tx,
            );
            if (!couponQuantity) {
                throw new BadRequestException('발급 수량이 초과되었습니다.');
            }

            //유저 쿠폰 지급
            const userCoupon = await this.couponRepository.insertUserCoupon(couponId, userId, tx);

            //쿠폰 재고 차감
            await this.couponRepository.decrementCouponQuantity(couponId, tx);

            return UserCouponResponseDto.of(userCoupon);
        });
    }
}
