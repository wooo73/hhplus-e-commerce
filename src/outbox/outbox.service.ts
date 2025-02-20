import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { OutboxRepository } from './outbox.repository';
import { convertDayjs, getPastMinuteDate } from '../common/util/date';

@Injectable()
export class OutboxService {
    constructor(
        private readonly outboxRepository: OutboxRepository,
        private readonly kafkaService: KafkaService,
    ) {}

    async createOutbox(outbox: {
        messageId: string;
        topic: string;
        message: string;
        status: string;
    }) {
        return await this.outboxRepository.createOutbox(outbox);
    }

    async getOutbox(messageId: string, status: string) {
        return await this.outboxRepository.findUniqueOutbox(messageId, status);
    }

    async updateOutbox(messageId: string, status: string) {
        return await this.outboxRepository.updateOutbox(messageId, status);
    }

    async retryUncompletedOutbox() {
        const uncommitOutboxList = await this.outboxRepository.findUncommitOutbox();

        const standardTime = getPastMinuteDate(5).set('second', 0);

        const retryList = uncommitOutboxList.filter((outbox) => {
            const createdAt = convertDayjs(outbox.createdAt).set('second', 0);
            return createdAt.isBefore(standardTime);
        });

        Promise.allSettled(
            retryList.map((outbox) => {
                const payload = {
                    messageId: outbox.messageId,
                    topic: outbox.topic,
                    message: outbox.message,
                    status: outbox.status,
                };
                this.kafkaService.publish(outbox.topic, payload);
            }),
        );
    }
}
