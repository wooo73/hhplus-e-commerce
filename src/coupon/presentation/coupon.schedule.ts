import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CouponService } from '../domain/coupon.service';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class CouponScheduler {
    private static readonly issue = 'coupon-issue-schedule';
    private static readonly load = 'coupon-load-schedule';

    constructor(
        private readonly loggerService: LoggerService,
        private readonly couponService: CouponService,
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS, {
        name: CouponScheduler.issue,
    })
    async issueCoupon() {
        const loadCouponMap = await this.couponService.getLoadCouponList();

        if (loadCouponMap.size <= 0) {
            return;
        }

        for (const [couponId, stock] of loadCouponMap) {
            this.loggerService.debug(`쿠폰 ID: ${couponId}, 수량: ${stock}`);
            await this.couponService.issueCouponRequestDequeue(Number(couponId));
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
        name: CouponScheduler.load,
    })
    async loadCouponStock() {
        await this.couponService.couponStockLoadInRedis();
    }
}
