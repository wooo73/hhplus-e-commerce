import { ApiProperty } from '@nestjs/swagger';
import { UserCoupon } from '@prisma/client';

export class UserCouponEntity implements UserCoupon {
    @ApiProperty({ example: 1, description: '사용자 쿠폰 ID' })
    id: number;

    @ApiProperty({ example: 1, description: '사용자 ID' })
    userId: number;

    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    couponId: number;

    @ApiProperty({ example: true, description: '사용 여부' })
    isUsed: boolean;

    @ApiProperty({ example: '2025-01-01', description: '사용 일시' })
    usedAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '생성일' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '수정일' })
    updatedAt: Date;
}
