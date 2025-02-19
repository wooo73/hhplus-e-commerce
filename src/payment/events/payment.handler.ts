import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { LoggerService } from '../../common/logger/logger.service';
import { OutboxService } from '../../outbox/outbox.service';

import { PaymentSuccessEvent } from '../../payment/events/payment-success-event';
import { KafkaTopic } from '../../common/kafkaTopic';

@EventsHandler(PaymentSuccessEvent)
export class PaymentHandler implements IEventHandler<PaymentSuccessEvent> {
    constructor(
        private readonly loggerService: LoggerService,
        private outboxService: OutboxService,
        @Inject('KAFKA_CLIENT')
        private readonly kafkaClient: ClientKafka,
    ) {}

    async handle(event: PaymentSuccessEvent) {
        try {
            //아웃 박스 데이터 생성(PUBLISH)
            await this.outboxService.createOutbox(event.payload);

            //카프카 메세지 발행
            this.kafkaClient.emit(KafkaTopic.PAYMENT_SUCCESS, JSON.stringify(event));
        } catch (err) {
            this.loggerService.error(err);
        }
    }
}
