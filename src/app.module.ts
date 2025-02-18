import { Module } from '@nestjs/common';
import { CouponModule } from './coupon/coupon.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './database/redis/redis.module';
import { AlimTalkModule } from './alim-talk/alim-talk.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'KAFKA_CLIENT',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'nestjs',
                        brokers: ['localhost:9092'],
                    },
                    consumer: {
                        groupId: 'helloKafka-client',
                    },
                },
            },
        ]),
        LoggerModule,
        PrismaModule,
        RedisModule,
        UserModule,
        ProductModule,
        OrderModule,
        CouponModule,
        PaymentModule,
        ScheduleModule.forRoot(),
        AlimTalkModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        AppService,
    ],
})
export class AppModule {}
