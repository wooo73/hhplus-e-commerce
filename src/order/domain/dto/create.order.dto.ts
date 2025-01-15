export class CreateOrderDto {
    userId: number;
    couponId: number;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    status: string;

    static from({
        userId,
        couponId,
        totalAmount,
        discountAmount,
        finalAmount,
        status,
    }: {
        userId: number;
        couponId: number;
        totalAmount: number;
        discountAmount: number;
        finalAmount: number;
        status: string;
    }) {
        const order = new CreateOrderDto();
        order.userId = userId;
        order.couponId = couponId;
        order.totalAmount = totalAmount;
        order.discountAmount = discountAmount;
        order.finalAmount = finalAmount;
        order.status = status;
        return order;
    }
}
