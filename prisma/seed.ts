import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await initTable();
    await createMockData();
}

async function initTable() {
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    await prisma.productQuantity.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.couponQuantity.deleteMany();
    await prisma.userCoupon.deleteMany();
    await prisma.order.deleteMany();
    await prisma.orderItem.deleteMany();
}

async function createMockData() {
    await Promise.all(
        Array.from({ length: 10 }, () =>
            prisma.user.create({
                data: { balance: 10000 },
            }),
        ),
    );

    //사용자 생성
    await Promise.all(
        Array.from({ length: 10 }, () =>
            prisma.user.create({
                data: { balance: 10000 },
            }),
        ),
    );

    //상품 생성 및 재고 생성
    for (const index of [...Array(30).keys()]) {
        await prisma.product.create({
            data: {
                name: `테스트상품${index + 1}`,
                price: Math.floor(Math.random() * 90001) + 10000, // 10000 ~ 100000 사이 랜덤 가격
                ProductQuantity: {
                    create: {
                        quantity: 10,
                        remainingQuantity: 10,
                    },
                },
            },
        });
    }

    //쿠폰 생성 및 재고 생성
    await prisma.coupon.create({
        data: {
            name: '테스트쿠폰',
            discountType: 'PERCENT',
            discountValue: 10,
            startAt: new Date(),
            endAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
            couponQuantity: {
                create: {
                    quantity: 10,
                    remainingQuantity: 10,
                },
            },
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
