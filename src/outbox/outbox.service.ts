import { Injectable } from '@nestjs/common';
import { OutboxRepository } from './outbox.repository';

@Injectable()
export class OutboxService {
    constructor(private readonly outboxRepository: OutboxRepository) {}

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
}
