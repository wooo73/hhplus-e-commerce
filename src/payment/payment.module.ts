import { Module } from '@nestjs/common';
import { PaymentService } from './application/payment.service';
import { PaymentController } from './presentation/payment.controller';

@Module({
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule {}
