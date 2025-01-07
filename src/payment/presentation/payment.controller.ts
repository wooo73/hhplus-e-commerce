import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from '../domain/payment.service';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConflictResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { PaymentRequestDto } from './dto/payment.request.dto';
import { PaymentResponseDto } from './dto/payment.response.dto';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post()
    @ApiOperation({ summary: '결제 요청', description: '주문에 대한 결제를 요청합니다.' })
    @ApiBody({ type: PaymentRequestDto })
    @ApiOkResponse({ description: '결제 결과', type: PaymentResponseDto })
    @ApiBadRequestResponse({ description: '비정상 쿠폰입니다.' })
    @ApiConflictResponse({ description: '품절된 상품입니다.' })
    async createPayment(@Body('paymentRequestDto') paymentRequestDto: PaymentRequestDto) {
        return {
            id: 1,
            userId: 1,
            couponId: 1,
            totalAmount: 30000,
            discountAmount: 5000,
            finalAmount: 25000,
            status: 'PAID',
            orderItems: [
                {
                    id: 1,
                    orderId: 1,
                    productId: 1,
                    quantity: 1,
                    price: 5000,
                },
            ],
        };
    }
}
