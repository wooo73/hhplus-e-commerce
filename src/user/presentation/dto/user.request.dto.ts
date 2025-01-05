import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserChargePointRequestDto {
    @ApiProperty({ example: 5_000, description: '충전 금액' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}
