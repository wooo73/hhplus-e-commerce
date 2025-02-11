export enum CouponStatus {
    AVAILABLE = 'AVAILABLE',
    USED = 'USED',
    EXPIRED = 'EXPIRED',
}

export enum CouponType {
    PRICE = 'PRICE',
    PERCENT = 'PERCENT',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}

export enum ProductStatus {
    IN_STOCK = 'IN_STOCK',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum AlimTalkResponse {
    SEND_SUCCESS = '알림톡 발송 완료',
    SEND_FAILED = '알림톡 발송 실패',
}
