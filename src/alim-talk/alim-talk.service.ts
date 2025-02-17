import { Injectable } from '@nestjs/common';
import { AlimTalkResponse } from '../common/status';
import { PaymentSuccessEvent } from 'src/payment/events/payment-success-event';

@Injectable()
export class AlimTalkService {
    async sendMessage(event: PaymentSuccessEvent) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return AlimTalkResponse.SEND_SUCCESS;
    }

    setMessage(message: PaymentSuccessEvent) {
        return message;
    }
}
