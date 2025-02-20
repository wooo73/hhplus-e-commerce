import { IEvent } from '@nestjs/cqrs';

export type PaymentSuccessEventType = {
    messageId: string;
    topic: string;
    message: string;
    status: string;
};

export class PaymentSuccessEvent implements IEvent {
    constructor(public readonly payload: PaymentSuccessEventType) {}
}
