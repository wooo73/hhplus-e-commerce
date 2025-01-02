import { ApiProperty } from '@nestjs/swagger';

export class Coupon {
    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    id: number;

    @ApiProperty({ example: '쿠폰 이름', description: '쿠폰 이름' })
    name: string;

    @ApiProperty({ example: 'FIXED_AMOUNT', description: '할인 타입(FIXED_AMOUNT, PERCENTAGE)' })
    discountType: string;

    @ApiProperty({ example: 1000, description: '할인 값 (금액 or %)' })
    discountValue: number;

    @ApiProperty({ example: true, description: '사용 가능 여부' })
    status: boolean;

    @ApiProperty({ example: '2025-01-01', description: '사용가능 시작일' })
    startAt: Date;

    @ApiProperty({ example: '2025-01-10', description: '사용가능 종료일' })
    endAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '생성일' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '수정일' })
    updatedAt: Date;
}
