## E-commerce

---

### ERD
![e-commerce-erd](https://github.com/user-attachments/assets/651a52e2-1301-464d-91cf-e30ecfccd5db)

-   user: 사용자 정보
-   product: 상품 정보
-   product_quantity: 상품의 재고 정보
-   order: 주문 정보
-   order_item: 주문 상품 정보
-   coupon: 쿠폰 정보
-   coupon_quantity: 쿠폰 발급 수량 정보
-   user_coupon: 유저가 보유한 쿠폰 정보

---

### 아키텍처 구조

```
src
 ┣ coupon
 ┃ ┣ application
 ┃ ┃ ┣ coupon.Irepository.ts
 ┃ ┃ ┣ coupon.service.spec.ts
 ┃ ┃ ┗ coupon.service.ts
 ┃ ┣ domain
 ┃ ┃ ┣ coupon.ts
 ┃ ┃ ┗ userCoupon.ts
 ┃ ┣ infrastructure
 ┃ ┃ ┗ coupon.repository.ts
 ┃ ┣ interface
 ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┗ coupon.response.dto.ts
 ┃ ┃ ┣ coupon.controller.spec.ts
 ┃ ┃ ┗ coupon.controller.ts
 ┃ ┗ coupon.module.ts
 ┣ database
 ┃ ┣ database.config.ts
 ┃ ┗ database.module.ts
 ┣ order
 ┃ ┣ application
 ┃ ┃ ┣ order.Irepository.ts
 ┃ ┃ ┣ order.service.spec.ts
 ┃ ┃ ┗ order.service.ts
 ┃ ┣ domain
 ┃ ┃ ┣ order-item.ts
 ┃ ┃ ┗ order.ts
 ┃ ┣ infrastructure
 ┃ ┃ ┗ order.repository.ts
 ┃ ┣ interface
 ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┣ order.request.dto.ts
 ┃ ┃ ┃ ┗ order.response.dto.ts
 ┃ ┃ ┣ order.controller.spec.ts
 ┃ ┃ ┗ order.controller.ts
 ┃ ┗ order.module.ts
 ┣ payment
 ┃ ┣ application
 ┃ ┃ ┣ payment.Irepository.ts
 ┃ ┃ ┣ payment.service.spec.ts
 ┃ ┃ ┗ payment.service.ts
 ┃ ┣ domain
 ┃ ┃ ┗ payment.ts
 ┃ ┣ infrastructure
 ┃ ┃ ┗ payment.repository.ts
 ┃ ┣ interface
 ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┣ payment.request.dto.ts
 ┃ ┃ ┃ ┗ payment.response.dto.ts
 ┃ ┃ ┣ payment.controller.spec.ts
 ┃ ┃ ┗ payment.controller.ts
 ┃ ┗ payment.module.ts
 ┣ product
 ┃ ┣ application
 ┃ ┃ ┣ product.Irepository.ts
 ┃ ┃ ┣ product.service.spec.ts
 ┃ ┃ ┗ product.service.ts
 ┃ ┣ domain
 ┃ ┃ ┣ product-quantity.ts
 ┃ ┃ ┗ product.ts
 ┃ ┣ infrastructure
 ┃ ┃ ┗ product.repository.ts
 ┃ ┣ interface
 ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┗ product.response.dto.ts
 ┃ ┃ ┣ product.controller.spec.ts
 ┃ ┃ ┗ product.controller.ts
 ┃ ┗ product.module.ts
 ┣ user
 ┃ ┣ application
 ┃ ┃ ┣ user.Irepository.ts
 ┃ ┃ ┣ user.service.spec.ts
 ┃ ┃ ┗ user.service.ts
 ┃ ┣ domain
 ┃ ┃ ┗ user.ts
 ┃ ┣ infrastructure
 ┃ ┃ ┗ user.repository.ts
 ┃ ┣ interface
 ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┣ user.request.dto.ts
 ┃ ┃ ┃ ┗ user.response.dto.ts
 ┃ ┃ ┣ user.controller.spec.ts
 ┃ ┃ ┗ user.controller.ts
 ┃ ┗ user.module.ts
 ┣ app.module.ts
 ┗ main.ts
```
