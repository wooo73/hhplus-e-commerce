import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '@prisma/client';

export class OrderItemEntity implements OrderItem {
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

    @ApiProperty({ example: '2025-01-01', description: '생성일' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '수정일' })
    updatedAt: Date;

    //엔티티 객체 생성
    static from(orderId: number, productId: number, quantity: number, price: number) {
        const orderItem = new OrderItemEntity();
        orderItem.orderId = orderId;
        orderItem.productId = productId;
        orderItem.quantity = quantity;
        orderItem.price = price;
        return orderItem;
    }
}
