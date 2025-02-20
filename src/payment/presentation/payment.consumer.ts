import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { LoggerService } from '../../common/logger/logger.service';
import { AlimTalkService } from '../../alim-talk/alim-talk.service';
import { OutboxService } from '../../outbox/outbox.service';

import { PaymentSuccessEventType } from '../events/payment-success-event';

import { KafkaTopic } from '../../common/kafkaTopic';
import { KafkaOutboxStatus } from '../../common/status';

@Controller('paymentConsumer')
export class PaymentConsumer {
    constructor(
        private readonly loggerService: LoggerService,
        private readonly alimTalkService: AlimTalkService,
        private outboxService: OutboxService,
    ) {}

    @MessagePattern(KafkaTopic.PAYMENT_SUCCESS)
    async sendAlimTalk(message: PaymentSuccessEventType) {
        let messageId: string;
        try {
            messageId = message.messageId;

            // 아웃 박스 메세지 데이터 상태 확인 status === PUBLISH
            const outbox = await this.outboxService.getOutbox(messageId, KafkaOutboxStatus.PUBLISH);

            if (outbox) {
                // 아웃 박스 메세지 데이터 업데이트 = COMPLETE
                await this.outboxService.updateOutbox(messageId, KafkaOutboxStatus.COMPLETE);

                this.loggerService.debug('알림톡 발송 시작');
                await this.alimTalkService.sendMessage(message);
                this.loggerService.debug('알림톡 발송 완료');
            }
        } catch (err) {
            await this.outboxService.updateOutbox(messageId, KafkaOutboxStatus.PUBLISH);
            this.loggerService.error(err);
        }
    }
}
