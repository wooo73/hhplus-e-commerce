import { Controller } from '@nestjs/common';
import { PaymentService } from '../application/payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}
}
