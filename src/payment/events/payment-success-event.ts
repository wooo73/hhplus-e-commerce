import { IEvent } from '@nestjs/cqrs';

export type PaymentSuccessEventType = {
    id: number;
    userId: number;
    couponId: number | null;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};

export class PaymentSuccessEvent implements IEvent {
    constructor(public readonly order: PaymentSuccessEventType) {}
}
