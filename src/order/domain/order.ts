export class OrderDomain {
    id: number;
    userId: number;
    couponId: number | null = null;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;

    //엔티티 객체 생성
    static from({
        id,
        userId,
        couponId,
        totalAmount,
        discountAmount,
        finalAmount,
        status,
    }: {
        id: number;
        userId: number;
        couponId: number;
        totalAmount: number;
        discountAmount: number;
        finalAmount: number;
        status: string;
    }) {
        const order = new OrderDomain();
        order.id = id;
        order.userId = userId;
        order.couponId = couponId;
        order.totalAmount = totalAmount;
        order.discountAmount = discountAmount;
        order.finalAmount = finalAmount;
        order.status = status;
        return order;
    }
}
