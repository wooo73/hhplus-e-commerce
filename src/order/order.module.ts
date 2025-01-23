import { Module } from '@nestjs/common';
import { OrderService } from './domain/order.service';
import { OrderController } from './presentation/order.controller';
import { ORDER_REPOSITORY } from './domain/order.repository';
import { OrderPrismaRepository } from './infrastructure/order.prisma.repository';
import { OrderFacade } from './application/order.facade';
import { UserService } from '../user/domain/user.service';
import { USER_REPOSITORY } from '../user/domain/user.repository';
import { UserPrismaRepository } from '../user/infrastructure/user.prisma.repository';
import { CouponService } from '../coupon/domain/coupon.service';
import { ProductService } from '../product/domain/product.service';
import { COUPON_REPOSITORY } from '../coupon/domain/coupon.repository';
import { CouponPrismaRepository } from '../coupon/infrastructure/coupon.prisma.repository';
import { PRODUCT_REPOSITORY } from '../product/domain/product.repository';
import { ProductPrismaRepository } from '../product/infrastructure/product.prisma.repository';
import { TRANSACTION_MANAGER } from '../common/transaction/transaction-client';
import { PrismaTransactionManager } from '../common/transaction/prisma.transaction-client';
import { LoggerModule } from '../common/logger/logger.module';
import { RedisModule } from '../database/redis/redis.module';

@Module({
    controllers: [OrderController],
    imports: [RedisModule, LoggerModule],
    providers: [
        OrderFacade,
        OrderService,
        UserService,
        CouponService,
        ProductService,
        { provide: ORDER_REPOSITORY, useClass: OrderPrismaRepository },
        { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
        { provide: COUPON_REPOSITORY, useClass: CouponPrismaRepository },
        { provide: PRODUCT_REPOSITORY, useClass: ProductPrismaRepository },
        { provide: TRANSACTION_MANAGER, useClass: PrismaTransactionManager },
    ],
})
export class OrderModule {}
