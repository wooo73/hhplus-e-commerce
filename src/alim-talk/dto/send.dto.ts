export class SendMessageDto {
    userId: number;
    subject: string;
    orderId: number;
    orderItem: {
        productId: number;
        productName: string;
        productPrice: number;
        productQuantity: number;
    }[];
    couponId: number;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    createdAt: string;
}
