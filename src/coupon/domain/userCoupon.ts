export class UserCouponDomain {
    id: number;
    userId: number;
    couponId: number;
    isUsed: boolean;
    usedAt: Date;
    createdAt: Date;
    updatedAt: Date;

    static from({
        id,
        userId,
        couponId,
        isUsed,
        usedAt,
        createdAt,
        updatedAt,
    }: {
        id: number;
        userId: number;
        couponId: number;
        isUsed: boolean;
        usedAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }) {
        const dto = new UserCouponDomain();
        dto.id = id;
        dto.userId = userId;
        dto.couponId = couponId;
        dto.isUsed = isUsed;
        dto.usedAt = usedAt;
        dto.createdAt = createdAt;
        dto.updatedAt = updatedAt;
        return dto;
    }
}
