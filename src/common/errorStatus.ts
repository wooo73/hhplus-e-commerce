export enum ErrorMessage {
    USER_NOT_FOUND = '사용자를 찾을 수 없습니다.',
    USER_BALANCE_NOT_ENOUGH = '잔액이 부족합니다.',
    USER_BALANCE_DECREASE_FAILED = '잔액 차감에 실패했습니다.',

    PRODUCT_OUT_OF_STOCK = '상품 재고가 부족합니다.',

    ORDER_NOT_FOUND = '주문 정보를 찾을 수 없습니다.',

    COUPON_NOT_FOUND = '쿠폰을 찾을 수 없습니다.',
    COUPON_INVALID = '유효하지 않은 쿠폰입니다.',
    COUPON_QUANTITY_EXCEEDED = '발급 수량이 초과되었습니다.',
}
