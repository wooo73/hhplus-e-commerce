export class CouponDomain {
    id: number;
    name: string;
    discountType: string;
    discountValue: number;
    status: string;
    startAt: Date;
    endAt: Date;
    createdAt: Date;
    updatedAt: Date;

    static from({
        id,
        name,
        discountType,
        discountValue,
        status,
        startAt,
        endAt,
        createdAt,
        updatedAt,
    }: {
        id: number;
        name: string;
        discountType: string;
        discountValue: number;
        status: string;
        startAt: Date;
        endAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }) {
        const dto = new CouponDomain();
        dto.id = id;
        dto.name = name;
        dto.discountType = discountType;
        dto.discountValue = discountValue;
        dto.status = status;
        dto.startAt = startAt;
        dto.endAt = endAt;
        dto.createdAt = createdAt;
        dto.updatedAt = updatedAt;
        return dto;
    }
}
