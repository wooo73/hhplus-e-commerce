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

### swagger
![스크린샷 2025-01-10 102825](https://github.com/user-attachments/assets/b8254abe-e87e-4329-a57d-ddb8ee97fd40)
![스크린샷 2025-01-10 102832](https://github.com/user-attachments/assets/36df8662-4cd5-4ef1-851b-d1053f7b3844)
![스크린샷 2025-01-10 102840](https://github.com/user-attachments/assets/07c7f993-a917-4cc8-85e1-7c09e7d709ce)
![스크린샷 2025-01-10 102845](https://github.com/user-attachments/assets/c7ba053e-2672-4fe8-adc1-4294575880c4)
![스크린샷 2025-01-10 102948](https://github.com/user-attachments/assets/37d26efa-d171-4877-98bf-d837289a938d)
![스크린샷 2025-01-10 102941](https://github.com/user-attachments/assets/50f79381-2583-464a-a8c8-4f80e5d8f139)
![스크린샷 2025-01-10 102936](https://github.com/user-attachments/assets/3b1ac717-6adb-4f7f-a224-de37335ec9b1)
![스크린샷 2025-01-10 102900](https://github.com/user-attachments/assets/abda56a6-ab63-48e6-8aaa-2bd352135715)
![스크린샷 2025-01-10 102855](https://github.com/user-attachments/assets/28698639-c810-4a3d-9188-cf2cd0ecaaa4)

