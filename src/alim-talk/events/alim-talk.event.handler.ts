import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AlimTalkService } from '../alim-talk.service';
import { LoggerService } from '../../common/logger/logger.service';
import { PaymentSuccessEvent } from 'src/payment/events/payment-success-event';

@EventsHandler(PaymentSuccessEvent)
export class AlimTalkHandler implements IEventHandler<PaymentSuccessEvent> {
    constructor(
        private readonly alimTalkService: AlimTalkService,
        private readonly loggerService: LoggerService,
    ) {}

    async handle(event: PaymentSuccessEvent) {
        try {
            this.loggerService.debug('알림톡 발송 시작');
            const message = this.alimTalkService.setMessage(event);
            const result = await this.alimTalkService.sendMessage(message);
            this.loggerService.debug(result);
        } catch (error) {
            // ...
            this.loggerService.error(error);
        }
    }
}
