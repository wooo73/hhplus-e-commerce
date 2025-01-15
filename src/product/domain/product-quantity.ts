export class ProductQuantityDomain {
    id: number;
    productId: number;
    quantity: number;
    remainingQuantity: number;

    static from({
        id,
        productId,
        quantity,
        remainingQuantity,
    }: {
        id: number;
        productId: number;
        quantity: number;
        remainingQuantity: number;
    }) {
        const domain = new ProductQuantityDomain();
        domain.id = id;
        domain.productId = productId;
        domain.quantity = quantity;
        domain.remainingQuantity = remainingQuantity;
        return domain;
    }
}
