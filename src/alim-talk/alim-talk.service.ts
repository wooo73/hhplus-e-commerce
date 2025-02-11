import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send.dto';
import { OrderWithItemDomain } from '../order/domain/order-with-item';
import { AlimTalkResponse } from '../common/status';

@Injectable()
export class AlimTalkService {
    async sendMessage(message: SendMessageDto) {
        new Promise((resolve) => setTimeout(resolve, 3000));
        return AlimTalkResponse.SEND_SUCCESS;
    }

    setMessage(message: OrderWithItemDomain) {
        return message;
    }
}
