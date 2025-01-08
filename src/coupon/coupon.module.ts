import { Module } from '@nestjs/common';
import { CouponService } from './domain/coupon.service';
import { CouponController } from './presentation/coupon.controller';
import { COUPON_REPOSITORY } from './domain/coupon.repository';
import { CouponPrismaRepository } from './infrastructure/coupon.prisma.repository';
import { TRANSACTION_MANAGER } from 'src/common/transaction/transaction-client';
import { PrismaTransactionManager } from 'src/common/transaction/prisma.transaction-client';

@Module({
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
})
export class CouponModule {}
