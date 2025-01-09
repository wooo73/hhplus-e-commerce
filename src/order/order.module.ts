import { Module } from '@nestjs/common';
import { OrderService } from './domain/order.service';
import { OrderController } from './presentation/order.controller';
import { ORDER_REPOSITORY } from './domain/order.repository';
import { OrderPrismaRepository } from './infrastructure/order.prisma.repository';
import { OrderFacade } from './application/order.facade';
import { UserService } from '../user/domain/user.service';
import { USER_REPOSITORY } from 'src/user/domain/user.repository';
import { UserPrismaRepository } from 'src/user/infrastructure/user.prisma.repository';
import { CouponService } from '../coupon/domain/coupon.service';
import { ProductService } from '../product/domain/product.service';
import { COUPON_REPOSITORY } from 'src/coupon/domain/coupon.repository';
import { CouponPrismaRepository } from 'src/coupon/infrastructure/coupon.prisma.repository';
import { PRODUCT_REPOSITORY } from 'src/product/domain/product.repository';
import { ProductPrismaRepository } from 'src/product/infrastructure/product.prisma.repository';
import { TRANSACTION_MANAGER } from 'src/common/transaction/transaction-client';
import { PrismaTransactionManager } from 'src/common/transaction/prisma.transaction-client';

@Module({
    controllers: [OrderController],
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
