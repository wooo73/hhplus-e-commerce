import { Module } from '@nestjs/common';
import { PaymentService } from './domain/payment.service';
import { PaymentController } from './presentation/payment.controller';
import { OrderService } from '../order/domain/order.service';
import { ORDER_REPOSITORY } from '../order/domain/order.repository';
import { OrderPrismaRepository } from '../order/infrastructure/order.prisma.repository';
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
import { PaymentFacade } from './application/payment.facade';

@Module({
    controllers: [PaymentController],
    providers: [
        PaymentService,
        PaymentFacade,
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
export class PaymentModule {}
