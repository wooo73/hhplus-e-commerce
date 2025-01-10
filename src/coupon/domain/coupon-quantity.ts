import { ApiProperty } from '@nestjs/swagger';
import { CouponQuantity } from '@prisma/client';

export class CouponQuantityEntity implements CouponQuantity {
    @ApiProperty({ example: 1, description: '쿠폰 수량 ID' })
    id: number;

    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    couponId: number;

    @ApiProperty({ example: 10, description: '총 재고' })
    quantity: number;

    @ApiProperty({ example: 5, description: '남은 재고' })
    remainingQuantity: number;
}
