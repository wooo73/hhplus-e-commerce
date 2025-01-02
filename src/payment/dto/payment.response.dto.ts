import { ApiProperty } from '@nestjs/swagger';
import { OrderResponseDto } from 'src/order/dto/order.response.dto';

export class PaymentResponseDto extends OrderResponseDto {
    @ApiProperty({ example: 'PAID', description: '주문 상태(PENDING, PAID, CANCELLED)' })
    status: string;
}
