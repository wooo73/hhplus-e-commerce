import { Module } from '@nestjs/common';
import { CouponService } from './domain/coupon.service';
import { CouponController } from './presentation/coupon.controller';
import { COUPON_REPOSITORY } from './domain/coupon.repository';
import { CouponPrismaRepository } from './infrastructure/coupon.prisma.repository';
import { TRANSACTION_MANAGER } from '../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../common/transaction/prisma.transaction-client';
import { RedisModule } from '../database/redis/redis.module';

@Module({
    imports: [RedisModule],
    controllers: [CouponController],
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
    exports: [CouponService, { provide: COUPON_REPOSITORY, useClass: CouponPrismaRepository }],
})
export class CouponModule {}
