import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LoggerService } from '../../common/logger/logger.service';
import { OutboxService } from '../../outbox/outbox.service';

import { PaymentSuccessEvent } from '../../payment/events/payment-success-event';
import { KafkaTopic } from '../../common/kafkaTopic';
import { KafkaService } from '../../kafka/kafka.service';

@EventsHandler(PaymentSuccessEvent)
export class PaymentHandler implements IEventHandler<PaymentSuccessEvent> {
    constructor(
        private readonly loggerService: LoggerService,
        private outboxService: OutboxService,
        private kafkaService: KafkaService,
    ) {}

    async handle(event: PaymentSuccessEvent) {
        try {
            //아웃 박스 데이터 생성(PUBLISH)
            await this.outboxService.createOutbox(event.payload);

            //카프카 메세지 발행
            this.kafkaService.publish(KafkaTopic.PAYMENT_SUCCESS, event.payload);
        } catch (err) {
            this.loggerService.error(err);
        }
    }
}
