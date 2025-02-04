import { Body, Controller, Post } from '@nestjs/common';
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
import { OrderFacade } from '../application/order.facade';

@Controller('order')
@ApiTags('Order')
export class OrderController {
    constructor(private readonly orderFacade: OrderFacade) {}

    @Post()
    @ApiOperation({ summary: '주문 요청', description: '주문을 요청합니다.' })
    @ApiBody({ type: OrderRequestDto })
    @ApiOkResponse({ description: '주문 결과', type: OrderResponseDto })
    @ApiBadRequestResponse({ description: '비정상 쿠폰입니다.' })
    @ApiNotFoundResponse({ description: '사용할 수 없는 쿠폰입니다.' })
    async createOrder(@Body() body: OrderRequestDto) {
        return await this.orderFacade.order(body);
    }

    @Post('/redis')
    @ApiOperation({ summary: '주문 요청', description: '주문을 요청합니다.' })
    @ApiBody({ type: OrderRequestDto })
    @ApiOkResponse({ description: '주문 결과', type: OrderResponseDto })
    @ApiBadRequestResponse({ description: '비정상 쿠폰입니다.' })
    @ApiNotFoundResponse({ description: '사용할 수 없는 쿠폰입니다.' })
    async createOrderWithRedis(@Body() body: OrderRequestDto) {
        return await this.orderFacade.orderWithRedLock(body);
    }
}
