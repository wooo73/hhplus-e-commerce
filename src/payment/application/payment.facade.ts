import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../user/domain/user.service';
import { OrderService } from '../../order/domain/order.service';

import {
    TRANSACTION_MANAGER,
    TransactionManager,
} from '../../common/transaction/transaction-client';
import { RedisService } from '../../database/redis/redis.service';

import { PaymentRequestDto } from '../presentation/dto/payment.request.dto';

@Injectable()
export class PaymentFacade {
    constructor(
        private readonly orderService: OrderService,
        private readonly userService: UserService,
        private readonly redisService: RedisService,
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
            return await this.orderService.payOrder(orderId, tx);

            //TODO: 외부 플랫폼 전송
        });
    }

    async paymentWithRedLock(dto: PaymentRequestDto) {
        const { orderId, userId } = dto;
        let lock;

        try {
            const lockDuration = 500;

            const retryCount = 0;
            const retryDelay = 0;

            await this.redisService.setRedLock(retryCount, retryDelay);

            const key = `payment:${orderId}`;
            lock = await this.redisService.acquireLock(key, lockDuration);

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
            await this.redisService.releaseLock(lock);
        }
    }
}
