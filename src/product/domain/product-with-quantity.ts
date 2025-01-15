export class ProductWithQuantityDomain {
    id: number;
    name: string;
    price: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    productQuantity: { quantity: number; remainingQuantity: number };

    static from({
        id,
        name,
        price,
        status,
        createdAt,
        updatedAt,
        productQuantity,
    }: {
        id: number;
        name: string;
        price: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productQuantity: { quantity: number; remainingQuantity: number };
    }) {
        const domain = new ProductWithQuantityDomain();
        domain.id = id;
        domain.name = name;
        domain.price = price;
        domain.status = status;
        domain.createdAt = createdAt;
        domain.updatedAt = updatedAt;
        domain.productQuantity = productQuantity;
        return domain;
    }
}
