import { Module } from '@nestjs/common';
import { CouponModule } from './coupon/coupon.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './database/prisma/prisma.module';

@Module({
    imports: [PrismaModule, UserModule, ProductModule, OrderModule, CouponModule, PaymentModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
