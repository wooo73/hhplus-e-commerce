import { Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { OutboxRepository } from './outbox.repository';
import { OutboxScheduler } from './outbox.schedule';
import { LoggerModule } from '../common/logger/logger.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
    imports: [LoggerModule, KafkaModule],
    providers: [OutboxService, OutboxRepository, OutboxScheduler],
    exports: [OutboxService, OutboxRepository],
})
export class OutboxModule {}
