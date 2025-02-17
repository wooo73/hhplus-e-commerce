import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentService } from './domain/payment.service';
import { PaymentController } from './presentation/payment.controller';
import { TRANSACTION_MANAGER } from '../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../common/transaction/prisma.transaction-client';
import { PaymentFacade } from './application/payment.facade';
import { RedisModule } from '../database/redis/redis.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { CouponModule } from '../coupon/coupon.module';
import { OrderModule } from '../order/order.module';
import { AlimTalkModule } from '../alim-talk/alim-talk.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
    imports: [
        LoggerModule,
        CqrsModule,
        RedisModule,
        ProductModule,
        UserModule,
        CouponModule,
        OrderModule,
        AlimTalkModule,
    ],
    controllers: [PaymentController],
    providers: [
        PaymentService,
        PaymentFacade,
        { provide: TRANSACTION_MANAGER, useClass: PrismaTransactionManager },
    ],
    exports: [PaymentFacade, PaymentService],
})
export class PaymentModule {}
