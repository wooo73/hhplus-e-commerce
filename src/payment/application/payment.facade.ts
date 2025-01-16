import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../user/domain/user.service';
import { OrderService } from '../../order/domain/order.service';
import { ProductService } from '../../product/domain/product.service';
import { CouponService } from '../../coupon/domain/coupon.service';
import {
    TRANSACTION_MANAGER,
    TransactionManager,
} from '../../common/transaction/transaction-client';
import { PaymentRequestDto } from '../presentation/dto/payment.request.dto';

@Injectable()
export class PaymentFacade {
    constructor(
        private readonly orderService: OrderService,
        private readonly userService: UserService,
        private readonly productService: ProductService,
        private readonly couponService: CouponService,
        @Inject(TRANSACTION_MANAGER) private readonly transactionManager: TransactionManager,
    ) {}
    async payment(dto: PaymentRequestDto) {
        const { orderId, userId } = dto;

        return await this.transactionManager.transaction(async (tx) => {
            //주문 조회
            const order = await this.orderService.getOrder(orderId, userId, tx);

            //유저 조회
            const user = await this.userService.findByIdWithLock(userId, tx);

            //유저 잔고 검증
            if (order.finalAmount > user.balance) {
                throw new BadRequestException('잔액이 부족합니다.');
            }

            //결제 금액 차감
            await this.userService.useUserBalance(userId, order.finalAmount, tx);

            //주문 상태 변경
            return await this.orderService.payOrder(orderId, tx);

            //TODO: 외부 플랫폼 전송
        });
    }
}
