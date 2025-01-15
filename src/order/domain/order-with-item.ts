import { OrderDomain } from './order';
import { OrderItemDomain } from './order-item';

export class OrderWithItemDomain extends OrderDomain {
    orderItem: OrderItemDomain[];

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
        orderItem,
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
        orderItem: OrderItemDomain[];
    }) {
        const domain = new OrderWithItemDomain();
        domain.id = id;
        domain.userId = userId;
        domain.couponId = couponId;
        domain.totalAmount = totalAmount;
        domain.discountAmount = discountAmount;
        domain.finalAmount = finalAmount;
        domain.status = status;
        domain.createdAt = createdAt;
        domain.updatedAt = updatedAt;
        domain.orderItem = orderItem;
        return domain;
    }
}
