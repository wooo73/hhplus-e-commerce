import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedlockService } from '../../database/redis/redlock.service';

@Injectable()
export class CouponRedisRepository {
    constructor(
        @InjectRedis() private redis: Redis,
        private readonly redlockService: RedlockService,
    ) {}

    async initRedLock(retryCount: number, retryDelay: number): Promise<void> {
        await this.redlockService.setRedLock(retryCount, retryDelay);
    }

    async acquireCouponIssueLock(key: string, duration?: number) {
        return await this.redlockService.acquireLock(key, duration);
    }

    async releaseCouponIssueLock(lock: any): Promise<void> {
        await this.redlockService.releaseLock(lock);
    }

    async setCouponStock(key: string, stock: number): Promise<void> {
        await this.redis.set(key, stock);
    }

    async getCouponStock(key: string): Promise<number | null> {
        const coupon = await this.redis.get(key);
        return coupon ? Number(coupon) : null;
    }

    async zaddCouponRequest(key: string, score: number, member: string): Promise<number> {
        return await this.redis.zadd(key, score, member);
    }

    async zpopminCouponRequest(key: string, range: number): Promise<string[]> {
        const queue = await this.redis.zpopmin(key, range);
        return queue.filter((_, index) => index % 2 === 0);
    }

    async saddIssueCoupon(key: string, member: string): Promise<number> {
        return await this.redis.sadd(key, member);
    }

    async sismemberCouponIssue(key: string, member: string): Promise<number> {
        return await this.redis.sismember(key, member);
    }

    async updateCouponStock(key: string, stock: number): Promise<string> {
        return await this.redis.set(key, stock);
    }

    async issueCouponRequestQueueCnt(key: string) {
        return await this.redis.zcard(key);
    }

    async IssueCouponQueueCnt(key: string) {
        return await this.redis.scard(key);
    }

    async getCouponStockLoadList(key: string) {
        return await this.redis.keys(`${key}*`);
    }

    async quit(): Promise<void> {
        await this.redis.quit();
    }
}
