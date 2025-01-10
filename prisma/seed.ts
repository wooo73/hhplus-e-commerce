import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await initTable();
    await createProductMockData();
}

async function initTable() {
    await prisma.productQuantity.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.couponQuantity.deleteMany();
    await prisma.userCoupon.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.user.deleteMany();
}

async function createProductMockData() {
    //상품 생성 및 재고 생성
    for (const index of [...Array(30).keys()]) {
        await prisma.product.create({
            data: {
                name: `테스트상품${index + 1}`,
                price: 5000,
                productQuantity: {
                    create: {
                        quantity: 10,
                        remainingQuantity: 10,
                    },
                },
            },
        });
    }
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
