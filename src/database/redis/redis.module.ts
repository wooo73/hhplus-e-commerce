import { Module } from '@nestjs/common';
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';
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
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}
