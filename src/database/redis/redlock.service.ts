import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import Redlock from 'redlock';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class RedlockService {
    private redlock: Redlock;
    private lockDuration: 1000;

    constructor(
        @InjectRedis() private redis: Redis,
        private readonly loggerService: LoggerService,
    ) {
        this.setRedLock(10, 300);

        this.redlock.on('clientError', (err) => {
            this.loggerService.error(err);
        });
    }

    async setRedLock(retryCount: number, retryDelay: number) {
        this.redlock = new Redlock([this.redis], {
            retryCount: retryCount,
            retryDelay: retryDelay,
        });
    }

    async acquireLock(key: string, duration: number = this.lockDuration) {
        return await this.redlock.acquire([`lock:${key}`], duration);
    }

    async releaseLock(lock: any) {
        await lock.release();
    }

    async quit() {
        await this.redis.quit();
    }
}
