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
    await prisma.user.create({
        data: { balance: 10000 },
    });

    await prisma.product.create({
        data: {
            name: '테스트 상품2',
            price: 50000,
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
