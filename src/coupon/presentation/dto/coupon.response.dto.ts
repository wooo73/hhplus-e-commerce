import { ApiProperty } from '@nestjs/swagger';

export class UserCouponResponseDto {
    @ApiProperty({ example: 1, description: '사용자 쿠폰 ID' })
    id: number;

    @ApiProperty({ example: 1, description: '사용자 ID' })
    userId: number;

    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    couponId: number;

    @ApiProperty({ example: true, description: '사용 여부' })
    isUsed: boolean;

    @ApiProperty({ example: '2025-01-01', description: '사용 일시' })
    usedAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '생성일' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '수정일' })
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
        const dto = new UserCouponResponseDto();
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

export class AvailableCouponResponseDto {
    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    id: number;

    @ApiProperty({ example: '쿠폰 이름', description: '쿠폰 이름' })
    name: string;

    @ApiProperty({ example: 'PRICE', description: '할인 타입(PRICE, PERCENT)' })
    discountType: string;

    @ApiProperty({ example: 1000, description: '할인 값 (금액 or %)' })
    discountValue: number;

    @ApiProperty({ example: 'AVAILABLE', description: '사용 가능 여부' })
    status: string;

    @ApiProperty({ example: '2025-01-01', description: '사용가능 시작일' })
    startAt: Date;

    @ApiProperty({ example: '2025-01-10', description: '사용가능 종료일' })
    endAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '생성일' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '수정일' })
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
        const dto = new AvailableCouponResponseDto();
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

export class UserCouponToUseResponseDto {
    userId: number;
    couponId: number;
    isUsed: boolean;
    usedAt: Date;
    discountType: string;
    discountValue: number;

    static from({
        userId,
        couponId,
        isUsed,
        usedAt,
        discountType,
        discountValue,
    }: {
        userId: number;
        couponId: number;
        isUsed: boolean;
        usedAt: Date;
        discountType: string;
        discountValue: number;
    }) {
        const dto = new UserCouponToUseResponseDto();
        dto.userId = userId;
        dto.couponId = couponId;
        dto.isUsed = isUsed;
        dto.usedAt = usedAt;
        dto.discountType = discountType;
        dto.discountValue = discountValue;
        return dto;
    }
}
