import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from '../application/order.service';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { OrderResponseDto } from './dto/order.response.dto';
import { OrderRequestDto } from './dto/order.request.dto';

@Controller('order')
@ApiTags('Order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    @ApiOperation({ summary: '주문 요청', description: '주문을 요청합니다.' })
    @ApiBody({ type: OrderRequestDto })
    @ApiOkResponse({ description: '주문 결과', type: OrderResponseDto })
    @ApiBadRequestResponse({ description: '비정상 쿠폰입니다.' })
    @ApiNotFoundResponse({ description: '상품을 조회할 수 없습니다.' })
    async createOrder(@Body('orderRequestDto') orderRequestDto: OrderRequestDto) {
        return {
            id: 1,
            userId: 1,
            couponId: 1,
            totalAmount: 30000,
            discountAmount: 5000,
            finalAmount: 25000,
            status: 'PENDING',
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
