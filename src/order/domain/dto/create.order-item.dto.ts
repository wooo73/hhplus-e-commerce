export class CreateOrderItemDto {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;

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
        const orderItem = new CreateOrderItemDto();
        orderItem.orderId = orderId;
        orderItem.productId = productId;
        orderItem.quantity = quantity;
        orderItem.price = price;
        return orderItem;
    }
}
