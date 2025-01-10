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
import { PaymentFacade } from '../application/payment.pacade';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
    constructor(private readonly paymentFacade: PaymentFacade) {}

    @Post()
    @ApiOperation({ summary: '결제 요청', description: '주문에 대한 결제를 요청합니다.' })
    @ApiBody({ type: PaymentRequestDto })
    @ApiOkResponse({ description: '결제 결과', type: PaymentResponseDto })
    @ApiBadRequestResponse({ description: '비정상 쿠폰입니다.' })
    @ApiConflictResponse({ description: '품절된 상품입니다.' })
    async createPayment(@Body() body: PaymentRequestDto) {
        return await this.paymentFacade.payment(body);
    }
}
