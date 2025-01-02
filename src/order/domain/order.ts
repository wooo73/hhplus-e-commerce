import { ApiProperty } from '@nestjs/swagger';

export class Order {
    @ApiProperty({ example: 1, description: '주문 ID' })
    id: number;

    @ApiProperty({ example: 1, description: '사용자 ID' })
    userId: number;

    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    couponId: number;

    @ApiProperty({ example: 30_000, description: '총 주문 금액' })
    totalAmount: number;

    @ApiProperty({ example: 5_000, description: '할인 금액' })
    discountAmount: number;

    @ApiProperty({ example: 25_000, description: '최종 결제 금액' })
    finalAmount: number;

    @ApiProperty({ example: 'PENDING', description: '주문 상태(PENDING, PAID, CANCELLED)' })
    status: string;

    @ApiProperty({ example: '2025-01-01', description: '생성일' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '수정일' })
    updatedAt: Date;
}
