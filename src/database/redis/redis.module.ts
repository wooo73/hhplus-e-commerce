import { Module } from '@nestjs/common';
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { RedlockService } from './redlock.service';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
    imports: [
        LoggerModule,
        IORedisModule.forRootAsync({
            useFactory: () => ({
                type: 'single',
                url: process.env.REDIS_URL,
                retryAttempts: 3,
                retryDelay: 3000,
                reconnectOnError: true,
            }),
        }),
    ],
    providers: [RedlockService],
    exports: [RedlockService],
})
export class RedisModule {}
