import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { COUPON_REPOSITORY, CouponRepository } from './coupon.repository';

import {
    TRANSACTION_MANAGER,
    TransactionClient,
    TransactionManager,
} from '../../common/transaction/transaction-client';

import {
    AvailableCouponResponseDto,
    UserCouponResponseDto,
    UserCouponToUseResponseDto,
} from '../presentation/dto/coupon.response.dto';

import { CouponType } from '../../common/status';
import { getCurrentDate } from '../../common/util/date';
import { ErrorMessage } from '../../common/errorStatus';

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

        const currentDate = getCurrentDate();

        // 발급 가능 쿠폰
        const coupons = await this.couponRepository.getAvailableCoupons(couponIds, currentDate);
        return coupons.map((coupon) => AvailableCouponResponseDto.from(coupon));
    }

    async issueCoupon(couponId: number, userId: number): Promise<UserCouponResponseDto> {
        const currentDate = getCurrentDate();

        // 유효 쿠폰: 발급 가능 상태, 사용기간이 지나지 않은 쿠폰, 발급 이력 없는 쿠폰
        const isCouponValid = await this.couponRepository.couponValidCheck(
            couponId,
            userId,
            currentDate,
        );
        if (!isCouponValid) {
            throw new BadRequestException(ErrorMessage.COUPON_INVALID);
        }

        return await this.transactionManager.transaction(async (tx) => {
            // 쿠폰 재고 확인(비관적 락)
            const couponQuantity = await this.couponRepository.couponQuantityValidCheckWithLock(
                couponId,
                tx,
            );
            if (!couponQuantity) {
                throw new BadRequestException(ErrorMessage.COUPON_QUANTITY_EXCEEDED);
            }

            //유저 쿠폰 지급
            const userCoupon = await this.couponRepository.insertUserCoupon(couponId, userId, tx);

            //쿠폰 재고 차감
            await this.couponRepository.decrementCouponQuantity(couponId, tx);

            return UserCouponResponseDto.from(userCoupon);
        });
    }

    async getUserCoupons(
        userId: number,
        take: number,
        skip: number,
    ): Promise<UserCouponResponseDto[]> {
        const userCoupons = await this.couponRepository.getUserOwnedCoupons(userId, take, skip);
        return userCoupons.map((userCoupon) => UserCouponResponseDto.from(userCoupon));
    }

    async getUserCouponToUseWithLock(
        userCouponId: number,
        userId: number,
        tx?: TransactionClient,
    ): Promise<UserCouponToUseResponseDto> {
        const userCoupon = await this.couponRepository.findByUserCouponIdWithLock(
            userCouponId,
            userId,
            tx,
        );

        if (!userCoupon) {
            throw new BadRequestException(ErrorMessage.COUPON_NOT_FOUND);
        }

        return UserCouponToUseResponseDto.from(userCoupon);
    }

    validateAndCalculateDiscountAmount(
        userCoupon: UserCouponToUseResponseDto,
        totalAmount: number,
    ) {
        const { discountType, discountValue } = userCoupon;

        if (!discountType || !discountValue) {
            throw new BadRequestException(ErrorMessage.COUPON_INVALID);
        }

        let discountAmount = 0;

        if (discountType === CouponType.PRICE) {
            discountAmount = discountValue;
        } else if (discountType === CouponType.PERCENT) {
            discountAmount = Math.round(totalAmount * (discountValue / 100));
        }

        return discountAmount;
    }

    async useCoupon(userCouponId: number, userId: number, tx?: TransactionClient): Promise<void> {
        return await this.couponRepository.updateCouponStatus(userCouponId, userId, tx);
    }
}
