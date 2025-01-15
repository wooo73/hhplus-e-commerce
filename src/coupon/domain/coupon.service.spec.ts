import { Test, TestingModule } from '@nestjs/testing';
import { CouponService } from './coupon.service';
import { COUPON_REPOSITORY, CouponRepository } from './coupon.repository';
import {
    TRANSACTION_MANAGER,
    TransactionManager,
} from '../../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../../common/transaction/prisma.transaction-client';
import { CouponPrismaRepository } from '../infrastructure/coupon.prisma.repository';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserCouponToUseResponseDto } from '../presentation/dto/coupon.response.dto';
import { CouponType } from '../../common/status';
import { ErrorMessage } from '../../common/errorStatus';

jest.mock('../../common/transaction/prisma.transaction-client.ts');
jest.mock('../infrastructure/coupon.prisma.repository');

describe('CouponService', () => {
    let service: CouponService;
    let repository;
    let transactionManager;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CouponService,
                {
                    provide: COUPON_REPOSITORY,
                    useClass: CouponPrismaRepository,
                },
                {
                    provide: TRANSACTION_MANAGER,
                    useClass: PrismaTransactionManager,
                },
            ],
        }).compile();

        service = module.get<CouponService>(CouponService);
        repository = module.get<CouponRepository>(COUPON_REPOSITORY);
        transactionManager = module.get<TransactionManager>(TRANSACTION_MANAGER);
    });

    describe('선착순 쿠폰 발급', () => {
        it('FAIL_쿠폰이 상태가 비정상 이거나 사용기간이 지났거나 발급한 쿠폰일 경우 "유효하지 않은 쿠폰입니다." 라는 에러를 던져야 합니다.', async () => {
            const couponId = 1;
            const userId = 1;

            repository.couponValidCheck.mockResolvedValue(false);

            await expect(service.issueCoupon(couponId, userId)).rejects.toThrow(
                new BadRequestException(ErrorMessage.COUPON_INVALID),
            );
        });

        it('FAIL_쿠폰 재고가 없을 경우 "쿠폰 재고가 없습니다." 라는 에러를 던져야 합니다.', async () => {
            const couponId = 1;
            const userId = 1;

            repository.couponValidCheck.mockResolvedValue(true);
            repository.couponQuantityValidCheckWithLock.mockResolvedValue(false);
            transactionManager.transaction.mockImplementation(async (fn) => {
                await fn();
            });

            await expect(service.issueCoupon(couponId, userId)).rejects.toThrow(
                new BadRequestException(ErrorMessage.COUPON_QUANTITY_EXCEEDED),
            );
        });
    });

    describe('쿠폰 사용', () => {
        it('FAIL_쿠폰을 찾을 수 없을 경우 "쿠폰을 찾을 수 없습니다." 라는 에러를 던져야 합니다.', async () => {
            const userCouponId = 1;
            const userId = 1;

            repository.findByUserCouponIdWithLock.mockResolvedValue(null);

            await expect(service.getUserCouponToUseWithLock(userCouponId, userId)).rejects.toThrow(
                new BadRequestException(ErrorMessage.COUPON_NOT_FOUND),
            );
        });

        it('FAIL_쿠폰의 상태가 등록되지 않은 경우 "쿠폰이 유효하지 않습니다." 라는 에러를 던져야 합니다.', async () => {
            const userCoupon = {
                userId: 1,
                couponId: 1,
                isUsed: false,
                discountType: null,
                discountValue: 10,
            };

            const userCouponToUseResponseDto = plainToInstance(
                UserCouponToUseResponseDto,
                userCoupon,
            );

            const totalAmount = 10000;

            try {
                service.validateAndCalculateDiscountAmount(userCouponToUseResponseDto, totalAmount);
                throw new Error('test');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe(ErrorMessage.COUPON_INVALID);
            }
        });

        it('FAIL_쿠폰의 할인가격이 등록되지 않은 경우 "쿠폰이 유효하지 않습니다." 라는 에러를 던져야 합니다.', async () => {
            const userCoupon = {
                userId: 1,
                couponId: 1,
                isUsed: false,
                discountType: CouponType.PRICE,
                discountValue: null,
            };

            const userCouponToUseResponseDto = plainToInstance(
                UserCouponToUseResponseDto,
                userCoupon,
            );

            const totalAmount = 10000;

            try {
                service.validateAndCalculateDiscountAmount(userCouponToUseResponseDto, totalAmount);
                throw new Error('test');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe(ErrorMessage.COUPON_INVALID);
            }
        });

        it('SUCCESS_총 주문 금액에서 할인 금액을 계산해야 합니다.', async () => {
            const userCoupon = {
                userId: 1,
                couponId: 1,
                isUsed: false,
                discountType: CouponType.PERCENT,
                discountValue: 10,
            };

            const userCouponToUseResponseDto = plainToInstance(
                UserCouponToUseResponseDto,
                userCoupon,
            );

            const totalAmount = 10000;

            const discountAmount = service.validateAndCalculateDiscountAmount(
                userCouponToUseResponseDto,
                totalAmount,
            );

            expect(discountAmount).toBe(1000);
        });
    });
});
