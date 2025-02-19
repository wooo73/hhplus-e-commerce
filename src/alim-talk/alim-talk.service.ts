import { Injectable } from '@nestjs/common';
import { AlimTalkResponse } from '../common/status';
import { PaymentSuccessEvent } from '../payment/events/payment-success-event';

@Injectable()
export class AlimTalkService {
    async sendMessage(message: PaymentSuccessEvent) {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        return AlimTalkResponse.SEND_SUCCESS;
    }

    setMessage(message: PaymentSuccessEvent) {
        return message;
    }
}
