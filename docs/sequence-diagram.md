| 기호 | 선 종류             | 응답 종류 | 의미                                |
| ---- | ------------------- | --------- | ----------------------------------- |
| ->>  | 실선                | 호출      | 데이터 전달 또는 메서드 호출        |
| -->> | 점선                | 응답      | 응답, 결과 반환                     |
| -)   | 화살 끝이 열린 실선 | 호출      | 데이터 전달 또는 메서드 호출(async) |
| --)  | 화살 끝이 열린 점선 | 응답      | 응답, 결과 반환(async)              |

### 1. 잔액 충전 시퀀스 다이어그램

```mermaid
sequenceDiagram
autonumber
    actor Client
    participant Controller
    participant Service
    participant Repository

    Client ->> Controller: POST payment/:userId
    activate Controller
    Controller ->> Service: chargePoint(userId, amount)
    activate Service

    Service ->> Repository: selectUserInfo(userId)
    activate Repository
    Repository -->> Service: 사용자 정보 반환
    deactivate Repository

    alt 사용자가 존재하지 않는 경우
        Service -->> Controller: NotFound 예외 발생
        Controller -->> Client: 404 응답
    else 충전 금액이 비정상일 경우
        Service ->> Controller: BadRequset 예외 발생
        Controller -->> Client: 400 응답
    else 정상 케이스
        Service ->> Repository: updatePoint(userId, amount)
        activate Repository
        Repository -->> Service: 성공 여부 반환
        deactivate Repository
    end
    Service -->> Controller: 충전 결과 반환
    deactivate Service
    Controller -->> Client: 200 / 결과 응답
    deactivate Controller

```

### 2. 잔액 조회 시퀀스 다이어 그램

```mermaid
sequenceDiagram
autonumber
    actor Client
    participant Controller
    participant Service
    participant Repository

    Client ->> Controller: GET user/:userId/balance
    activate Controller
    Controller ->> Service: getBalance(userId)
    activate Service
    Service ->> Repository: selectUserBalance(userId)
    activate Repository
    Repository -->> Service: 사용자 잔액 정보 반환
    deactivate Repository

    alt 데이터가 존재하지 않는 경우
        Service -->> Controller: NotFound 예외 발생
        Controller -->> Client: 404 응답
    else 정상 처리
    Service -->> Controller: 사용자 잔액 정보 반환
    deactivate Service
    Controller -->> Client: 200 / 결과 응답
    deactivate Controller
    end
```

### 3. 상품 조회 시퀀스 다이어그램

```mermaid
sequenceDiagram
autonumber
    actor Client
    participant Controller
    participant Service
    participant Repository

    Client ->> Controller: GET product/:productId
    activate Controller
    Controller ->> Service: getProduct(productId)
    activate Service
    Service ->> Repository: selectProductById(productId)
    activate Repository
    Repository -->> Service: 상품 정보 반환
    deactivate Repository
    Note over Service,Repository: 없을 경우 {}

    Service -->> Controller: 상품 정보 반환
    deactivate Service
    Controller -->> Client: 200 / 결과 응답
    deactivate Controller
```

### 4. 상위 상품 조회 시퀀스 다이어그램

```mermaid
sequenceDiagram
autonumber
    actor Client
    participant Controller
    participant Service
    participant Repository

    Client ->> Controller: GET product/special
    activate Controller
    Controller ->> Service: getSpecialProducts()
    activate Service
    Service ->> Repository: selectSpecialProducts()
    activate Repository
    Repository -->> Service: 상위 상품 정보 반환
    deactivate Repository
    Note over Service,Repository: 최근 3일간 가장 많이 팔린 <br/> 5개 상품 정보 / 없을 경우 []

    Service -->> Controller: 상위 상품 정보 반환
    deactivate Service
    Controller -->> Client: 200 / 결과 응답
    deactivate Controller
```

### 5. 선착순 쿠폰 발급 시퀀스 다이어그램

```mermaid
sequenceDiagram
autonumber
    actor Client
    participant Controller
    participant Service
    participant Repository
    participant DB

    Client ->> Controller: POST coupon/:couponId
    activate Controller
    Controller ->> Service: createCoupon(userId, couponId)
    activate Service
    Service ->> Repository: selectCoupon(userId)
    activate Repository
    Repository ->> DB: SELECT * from coupon where ~~ FOR UPDATE
    Note over Repository, DB: 발급 받을 쿠폰 락 적용
    activate DB
    DB -->> Repository: 쿠폰 정보 반환
    deactivate DB
    Repository -->> Service: 쿠폰 정보 반환
    deactivate Repository

    alt 쿠폰 발급 정원이 꽉찬 경우
        Service -->> Controller: Conflict 예외 발생
        Controller -->> Client: 409 응답
    else 쿠폰 발급 정원이 남은 경우
        Service ->> Repository: insertCoupon(userId, couponId)
        activate Repository
        Repository ->> DB: INSERT coupon
        activate DB
        DB -->> Repository: 데이터 삽입 결과 반환
        deactivate DB
        Repository -->> Service: 쿠폰 지급 결과 반환
        deactivate Repository
        Service -->> Controller: 쿠폰 지급 결과 반환
        deactivate Service
    end
    Controller -->> Client: 200 / 결과 응답
    deactivate Controller
```

### 6. 보유 쿠폰 목록 조회 시퀀스 다이어그램

```mermaid
sequenceDiagram
autonumber
    actor Client
    participant Controller
    participant Service
    participant Repository

    Client ->> Controller: GET user/:userId/coupon
    activate Controller
    Controller ->> Service: getUserCoupon(userId)
    activate Service
    Service ->> Repository: selectUserCoupons(userId)
    activate Repository
    Repository -->> Service: 쿠폰 정보 반환
    deactivate Repository

    Service -->> Controller: 쿠폰 정보 반환
    deactivate Service
    Controller -->> Client: 200 / 결과 응답
    deactivate Controller
```

### 7. 상품 주문/결제 시퀀스 다이어그램

```mermaid
sequenceDiagram
autonumber
    actor Client
    participant Controller as OrderController
    participant OrderService
    participant PaymentService
    participant OrderRepository
    participant PaymentRepository
    participant CouponService
    participant DataPlatform
    participant DB

    Client ->> Controller: POST /api/orders (userId,couponId, [{productId, quantity}])
    activate Controller

    Controller ->> OrderService: createOrder(userId, orderItems)
    activate OrderService

    %% 상품 및 재고 검증
    OrderService ->> OrderRepository: findProducts(productIds)
    activate OrderRepository
    Note over OrderRepository,DB: 상품 재고 비관적 락
    OrderRepository ->> DB: SELECT * FROM products WHERE id IN (:productIds) FOR UPDATE
    DB -->> OrderRepository: 상품 정보 반환
    OrderRepository -->> OrderService: 상품 정보 반환
    deactivate OrderRepository

    alt 상품이 없는 경우
        OrderService -->> Controller: NotFound 예외
        Controller -->> Client: 404 Response
    else 재고 부족
        OrderService -->> Controller: UnprocessableEntity 예외
        Controller -->> Client: 422 Response
    else 정상 케이스
        %% 결제 처리
        OrderService ->> PaymentService: processPayment(userId, totalAmount)
        activate PaymentService
        PaymentService ->> CouponService: getCoupon(userId,couponId)
        activate CouponService
        CouponService -->> PaymentService: 쿠폰 정보 반환
        deactivate CouponService
        opt 쿠폰 비정상
            PaymentService -->> OrderService: BadRequest 예외
            OrderService -->> Controller: BadRequest 예외
            Controller -->> Client: 400 Response
        end
        PaymentService -->> PaymentService: 쿠폰 적용
        PaymentService ->> PaymentRepository: getUserInfo(userId)
        activate PaymentRepository
        Note over PaymentRepository,DB: 사용자 잔액 비관적 락
        PaymentRepository ->> DB: SELECT * FROM users WHERE id = :userId FOR UPDATE
        DB -->> PaymentRepository: 잔액 정보 반환
        PaymentRepository -->> PaymentService: 잔액 정보 반환
        deactivate PaymentRepository

        alt 잔액 부족
            PaymentService -->> OrderService: BadRequest 예외
            OrderService -->> Controller: BadRequest 예외
            Controller -->> Client: 400 Response
        else 정상 결제
            PaymentService ->> PaymentRepository: updateBalance(userId, amount)
            activate PaymentRepository
            PaymentRepository ->> DB: UPDATE users
            DB -->> PaymentRepository: 잔액 차감 결과 반환
            PaymentRepository -->> PaymentService: 성공 반환
            deactivate PaymentRepository

            %% 주문 정보 저장
            OrderService ->> OrderRepository: saveOrder(order)
            activate OrderRepository
            OrderRepository ->> DB: INSERT INTO orders
            DB -->> OrderRepository: 주문 정보 저장 반환
            OrderRepository -->> OrderService: 주문 정보
            deactivate OrderRepository

            %% 재고 차감
            OrderService ->> OrderRepository: updateStock(products)
            activate OrderRepository
            OrderRepository ->> DB: UPDATE products
            DB -->> OrderRepository: 재고 차감 결과 반환
            OrderRepository -->> OrderService: 성공 반환
            deactivate OrderRepository

            %% 데이터 플랫폼 전송
            OrderService --)+ DataPlatform: sendOrderData(orderInfo)
            DataPlatform --)-  OrderService: 전송 완료

            PaymentService -->> OrderService: 결제 완료
            deactivate PaymentService
            OrderService -->> Controller: 주문 완료
            deactivate OrderService
            Controller -->> Client: 200 / 주문 정보
            deactivate Controller
        end
    end
```
