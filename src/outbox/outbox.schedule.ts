import { Injectable } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OutboxScheduler {
    private static readonly retry = 'retry-uncommit-schedule';

    constructor(private readonly outboxService: OutboxService) {}

    @Cron(CronExpression.EVERY_5_MINUTES, {
        name: OutboxScheduler.retry,
    })
    async retryOutboxScheduler() {
        await this.outboxService.retryUncompletedOutbox();
    }
}
