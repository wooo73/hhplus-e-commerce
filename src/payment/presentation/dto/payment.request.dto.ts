import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { OrderResponseDto } from 'src/order/presentation/dto/order.response.dto';

export class PaymentRequestDto {
    @ApiProperty({ description: '주문 ID', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    orderId: number;

    @ApiProperty({ description: '유저 ID', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}
