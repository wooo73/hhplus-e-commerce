import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UserChargePointRequestDto {
    @ApiProperty({ example: 5_000, description: '충전 금액' })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    amount: number;
}
