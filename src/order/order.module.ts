import { Module } from '@nestjs/common';
import { OrderService } from './domain/order.service';
import { OrderController } from './presentation/order.controller';
import { ORDER_REPOSITORY } from './domain/order.repository';
import { OrderPrismaRepository } from './infrastructure/order.prisma.repository';
import { OrderFacade } from './application/order.facade';
import { TRANSACTION_MANAGER } from '../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../common/transaction/prisma.transaction-client';
import { LoggerModule } from '../common/logger/logger.module';
import { RedisModule } from '../database/redis/redis.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { CouponModule } from '../coupon/coupon.module';

@Module({
    imports: [RedisModule, LoggerModule, ProductModule, UserModule, CouponModule],
    controllers: [OrderController],
    providers: [
        OrderFacade,
        OrderService,
        { provide: ORDER_REPOSITORY, useClass: OrderPrismaRepository },
        { provide: TRANSACTION_MANAGER, useClass: PrismaTransactionManager },
    ],
    exports: [OrderService, { provide: ORDER_REPOSITORY, useClass: OrderPrismaRepository }],
})
export class OrderModule {}
