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

    Client ->> Controller: API 요청
    activate Controller
    Controller ->> Service: 포인트 충전(userId, amount)
    activate Service

    Service ->> Service: 충전 금액 유효성 검사
    alt 충전 금액 비정상
        Service -->> Controller: BadRequest 예외 발생
        Controller -->> Client: 400 응답
    end

    Service ->> Repository: 유저 정보 조회(userId)
    activate Repository
    Repository -->> Service: 유저 정보 반환
    deactivate Repository
    alt 유저가 없을때
        Service -->> Controller: NotFound 예외 발생
        Controller -->> Client: 404 응답
    end

    Service ->> Service: 총 충전 잔액 연산
    Service ->> Repository: 잔액 수정(userId, amount)
    activate Repository
    Repository -->> Service: 성공 여부 반환
    deactivate Repository
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

    Client ->> Controller: API 요청
    activate Controller
    Controller ->> Service: 유저 잔액 조회(userId)
    activate Service
    Service ->> Repository: 유저 잔액 조회(userId)
    activate Repository
    Repository -->> Service: 유저 잔액 정보 반환
    deactivate Repository

    alt 유저 정보 없을때
        Service -->> Controller: NotFound 예외 발생
        Controller -->> Client: 404 응답
    end

    Service -->> Controller: 유저 잔액 정보 반환
    deactivate Service
    Controller -->> Client: 200 / 결과 응답
    deactivate Controller
```

### 3. 상품 조회 시퀀스 다이어그램

```mermaid
sequenceDiagram
autonumber
    actor Client
    participant Controller
    participant Service
    participant Repository

    Client ->> Controller: API 요청
    activate Controller

    Controller ->> Service: 상품 목록 조회()
    activate Service

    Service ->> Repository: 상품 목록 조회()
    activate Repository

    Repository -->> Service: 상품 정보 반환
    deactivate Repository

    Note over Controller, Service: 상품 정보 없을 경우 []
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

    Client ->> Controller: API 요청
    activate Controller
    Controller ->> Service: 상위 상품 조회()
    activate Service
    Service ->> Service: 일자 산출

    Service ->> Repository: 상위 상품 조회(일자)
    activate Repository

    Repository -->> Service: 상위 상품 정보 반환
    deactivate Repository

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

    Client ->> Controller: API 요청
    activate Controller

    Controller ->> Service: 쿠폰 발급(userId, couponId)
    activate Service

    Service ->> Repository: 쿠폰 정보 조회(couponId)
    Note over Repository: 발급 받을 쿠폰 락 적용(FOR UPDATE)
    activate Repository

    Repository -->> Service: 쿠폰 정보 반환
    deactivate Repository

    alt 잔여 수량 <= 0
        Service -->> Controller: Conflict 예외 발생
        Controller -->> Client: 409 응답
    end

    Service ->> Repository: 쿠폰 발급(userId, couponId)
    activate Repository
    Repository ->> Repository: 쿠폰 수량 차감
    Repository -->> Service: 쿠폰 발급 결과 반환
    deactivate Repository

    Service -->> Controller: 쿠폰 발급 결과 반환
    deactivate Service

    Controller -->> Client: 200 / 결과 응답
    deactivate Controller
```

### 7. 상품 주문 시퀀스 다이어그램

```mermaid
sequenceDiagram
autonumber
    actor cl as Client
    participant co as Controller
    participant s as Service
    participant r as Repository

    cl ->> co: API 요청
    activate co

    co ->> s: 주문 요청(userId, couponId, [product, ...])
    activate s

    s ->> s: 주문 상품 ids 배열 추출
    s ->> r: 주문 상품 조회([...ids])
    activate r
    r -->> s: 주문 상품 정보 반환
    deactivate r

    loop 주문 상품
        opt 주문 상품 재고 <= 0
            s -->> co: Conflict 예외 발생
            co -->> cl: 409 응답
        end
    end

    s -->> r: 쿠폰 정보 조회(userId, couponId)
    activate r
    r -->> s: 쿠폰 정보 반환
    deactivate r

    opt 쿠폰 비정상
        s -->> co: BadRequest 예외 발생
        co -->> cl: 404 응답
    end

    s ->> s: 총 결제 금액 - 쿠폰 할인 금액 산출
    s ->> r: 쿠폰 상태 수정(userCoupon)

    s ->> r: 유저 정보 조회(userId)
    activate r
    r -->> s: 유저 정보 반환
    deactivate r

    alt 유저 정보 없을 경우
        s -->> co: NotFound 예외 발생
        co -->> cl: 404 응답
    else 결제 금액 > 잔액
        s -->> co: BadRequest 예외 발생
        co -->> cl: 400 응답
    end

    s ->> r: 주문 생성(order)
    activate r
    r -->> s: 주문 생성 결과 반환
    deactivate r
    s -->> co: 주문 생성 결과 반환
    co -->> cl: 200 / 주문 정보 응답
```

### 8. 결제 시퀀스 다이어그램

```mermaid
sequenceDiagram
autonumber
    actor cl as Client
    participant co as Controller
    participant s as Service
    participant r as Repository
    participant df as DataPlatform

    cl ->> co: API 요청
    activate co

    co ->> s: 결제 요청(order)
    s ->> r: (FOR UPDATE)주문 정보 조회(order)
    Note over s,r: 주문 정보: 주문 상품, 재고, 결제금액
    activate r
    r -->> s: 주문 정보 반환
    deactivate r

    s ->> r: (FOR UPDATE)유저 정보 조회
    activate r
    r -->> s: 유저 정보 반환
    deactivate r

    alt 주문 정보 없을 경우
        s -->> co: NotFound 예외 발생
        co -->> cl: 404 응답
    else 유저 정보 없을 경우
        s -->> co: NotFound 예외 발생
        co -->> cl: 404 응답
    else 결제 금액 > 잔액
        s -->> co: BadRequest 예외 발생
        co -->> cl: 400 응답
    end

    loop 주문 상품
        opt 주문 상품 재고 <= 0
            s -->> co: Conflict 예외 발생
            co -->> cl: 409 응답
        end
    end

    s ->> r: 유저 결제 금액 차감(order)
    activate r
    loop 주문 상품
        s ->> r: 주문 상품 재고 차감(order)
    end
    s ->> r: 주문 상태 수정(order)
    s -) df: 주문 데이터 전달(order)

    r -->> s: 결제 응답 반환
    deactivate r

    s -->> co: 결제 응답 반환
    co -->> cl: 200/ 결제 정보
```
