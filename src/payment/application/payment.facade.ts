import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import * as crypto from 'crypto';

import { UserService } from '../../user/domain/user.service';
import { OrderService } from '../../order/domain/order.service';

import {
    TRANSACTION_MANAGER,
    TransactionManager,
} from '../../common/transaction/transaction-client';
import { RedlockService } from '../../database/redis/redlock.service';

import { PaymentRequestDto } from '../presentation/dto/payment.request.dto';
import { PaymentSuccessEvent } from '../events/payment-success-event';
import { KafkaTopic } from '../../common/kafkaTopic';
import { KafkaOutboxStatus } from '../../common/status';

@Injectable()
export class PaymentFacade {
    constructor(
        private readonly orderService: OrderService,
        private readonly userService: UserService,
        private readonly redlockService: RedlockService,
        private eventBus: EventBus,
        @Inject(TRANSACTION_MANAGER) private readonly transactionManager: TransactionManager,
    ) {}
    async payment(dto: PaymentRequestDto) {
        const { orderId, userId } = dto;

        return await this.transactionManager.transaction(async (tx) => {
            //주문 조회
            const order = await this.orderService.getOrder(orderId, userId, tx);

            //유저 조회
            const user = await this.userService.getUserBalance(userId, tx);

            //결제 금액 차감
            await this.userService.useUserBalance(userId, user.balance, order.finalAmount, tx);

            //주문 상태 변경
            const updatedOrder = await this.orderService.payOrder(orderId, tx);

            const payload = {
                messageId: crypto.randomUUID(),
                topic: KafkaTopic.PAYMENT_SUCCESS,
                message: JSON.stringify(updatedOrder),
                status: KafkaOutboxStatus.PUBLISH,
            };

            //알림톡
            this.eventBus.publish(new PaymentSuccessEvent(payload));

            return updatedOrder;
        });
    }

    async paymentWithRedLock(dto: PaymentRequestDto) {
        const { orderId, userId } = dto;
        let lock;

        try {
            const lockDuration = 500;

            const retryCount = 0;
            const retryDelay = 0;

            await this.redlockService.setRedLock(retryCount, retryDelay);

            const key = `payment:${orderId}`;
            lock = await this.redlockService.acquireLock(key, lockDuration);

            return await this.transactionManager.transaction(async (tx) => {
                //주문 조회
                const order = await this.orderService.getOrder(orderId, userId, tx);

                //유저 조회
                const user = await this.userService.getUserBalance(userId, tx);

                //결제 금액 차감
                await this.userService.useUserBalance(userId, user.balance, order.finalAmount, tx);

                //주문 상태 변경
                return await this.orderService.payOrder(orderId, tx);

                //TODO: 외부 플랫폼 전송
            });
        } catch (err) {
            throw err;
        } finally {
            await this.redlockService.releaseLock(lock);
        }
    }
}
