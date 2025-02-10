import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/database/prisma/prisma.service';
import { getCustomAddDateTime } from '../../src/common/util/date';

const configService = new ConfigService();
const prisma = new PrismaService(configService);

async function initTable() {
    await prisma.$executeRaw`TRUNCATE TABLE product_quantity`;
    await prisma.$executeRaw`TRUNCATE TABLE order_item`;
    await prisma.$executeRaw`TRUNCATE TABLE coupon_quantity`;
    await prisma.$executeRaw`TRUNCATE TABLE user_coupon `;
    await prisma.$executeRaw`TRUNCATE TABLE \`order\``;
    await prisma.$executeRaw`TRUNCATE TABLE product`;
    await prisma.$executeRaw`TRUNCATE TABLE coupon`;
    await prisma.$executeRaw`TRUNCATE TABLE user`;
}

async function createProductMockData() {
    //기본 상품 생성 및 재고 생성
    for (const index of [...Array(30).keys()]) {
        await prisma.product.create({
            data: {
                name: `테스트상품${index + 1}`,
                price: 5000,
                productQuantity: {
                    create: {
                        quantity: 50,
                        remainingQuantity: 50,
                    },
                },
            },
        });
    }
}

async function createUserMockData() {
    Array.from(
        { length: 30 },
        async () =>
            await prisma.user.create({
                data: {
                    balance: 100000,
                },
            }),
    );
}

async function createCouponMockData() {
    const format = 'YYYY-MM-DD HH:mm:ss';
    const couponStartDate = new Date(getCustomAddDateTime(0, 0, 0, format));
    const couponEndDate = new Date(getCustomAddDateTime(30, 0, 0, format));

    Array.from({ length: 5 }, async (_, index) => {
        await prisma.coupon.create({
            data: {
                name: `테스트쿠폰${index + 1}`,
                discountType: 'PERCENT',
                discountValue: 10,
                status: 'AVAILABLE',
                startAt: couponStartDate,
                endAt: couponEndDate,
                couponQuantity: {
                    create: {
                        quantity: 30,
                        remainingQuantity: 30,
                    },
                },
            },
        });
    });
}

async function createOrderMockData() {
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();

    const userId = users[0].id;
    const { id, price } = products[0];

    await prisma.order.create({
        data: {
            userId: userId,
            totalAmount: price,
            discountAmount: 0,
            finalAmount: price,
            status: 'PENDING',
            couponId: null,
            orderItem: {
                create: {
                    productId: id,
                    quantity: 1,
                    price,
                },
            },
        },
    });
}

(async () => {
    await initTable();
    // await createProductMockData();
    // await createUserMockData();
    // await createCouponMockData();
    // await createOrderMockData();
})();
