import { ApiProperty } from '@nestjs/swagger';

export class UserChargePointRequestDto {
    @ApiProperty({ example: 5_000, description: '충전 금액' })
    amount: number;
}
