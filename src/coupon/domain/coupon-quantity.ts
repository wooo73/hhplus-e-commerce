export class CouponQuantityDomain {
    id: number;
    couponId: number;
    quantity: number;
    remainingQuantity: number;

    static from({
        id,
        couponId,
        quantity,
        remainingQuantity,
    }: {
        id: number;
        couponId: number;
        quantity: number;
        remainingQuantity: number;
    }) {
        const dto = new CouponQuantityDomain();
        dto.id = id;
        dto.couponId = couponId;
        dto.quantity = quantity;
        dto.remainingQuantity = remainingQuantity;
        return dto;
    }
}
