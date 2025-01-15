import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
    @ApiProperty({ example: 1, description: '주문 상품 ID' })
    id: number;

    @ApiProperty({ example: 1, description: '주문 ID' })
    orderId: number;

    @ApiProperty({ example: 1, description: '상품 ID' })
    productId: number;

    @ApiProperty({ example: 1, description: '구매 수량' })
    quantity: number;

    @ApiProperty({ example: 5_000, description: '구매 시점의 상품 가격' })
    price: number;
}

export class OrderResponseDto {
    @ApiProperty({ example: 1, description: '주문 ID' })
    id: number;

    @ApiProperty({ example: 1, description: '사용자 ID' })
    userId: number;

    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    couponId: number | null = null;

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

    @ApiProperty({ type: [OrderItemResponseDto], description: '주문 상품 목록' })
    orderItems: OrderItemResponseDto[];

    static from({
        id,
        userId,
        couponId,
        totalAmount,
        discountAmount,
        finalAmount,
        status,
        createdAt,
        updatedAt,
        orderItems,
    }: {
        id: number;
        userId: number;
        couponId: number | null;
        totalAmount: number;
        discountAmount: number;
        finalAmount: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        orderItems: OrderItemResponseDto[];
    }) {
        const orderResponseDto = new OrderResponseDto();
        orderResponseDto.id = id;
        orderResponseDto.userId = userId;
        orderResponseDto.couponId = couponId;
        orderResponseDto.totalAmount = totalAmount;
        orderResponseDto.discountAmount = discountAmount;
        orderResponseDto.finalAmount = finalAmount;
        orderResponseDto.status = status;
        orderResponseDto.createdAt = createdAt;
        orderResponseDto.updatedAt = updatedAt;
        orderResponseDto.orderItems = orderItems;
        return orderResponseDto;
    }
}
