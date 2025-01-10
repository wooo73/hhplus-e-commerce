import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

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
