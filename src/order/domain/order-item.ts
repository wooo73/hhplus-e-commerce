export class OrderItemDomain {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;

    static from({
        orderId,
        productId,
        quantity,
        price,
    }: {
        orderId: number;
        productId: number;
        quantity: number;
        price: number;
    }) {
        const orderItem = new OrderItemDomain();
        orderItem.orderId = orderId;
        orderItem.productId = productId;
        orderItem.quantity = quantity;
        orderItem.price = price;
        return orderItem;
    }
}
