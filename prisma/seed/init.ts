import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/database/prisma/prisma.service';
import { getCustomAddDateTime } from '../../src/common/util/date';
import fs from 'fs';
import path from 'path';
import { OrderStatus } from '../../src/common/status';

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

async function createOrderMockDataCsv() {
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();

    const orders = [];
    const orderItems = [];

    const dateList = ['2025-02-07 13:40:00', '2025-02-09 14:20:00', '2025-02-10 15:00:00'];
    const quantityList = [1, 2, 3];
    const orderStatusList = [OrderStatus.PENDING, OrderStatus.PAID];

    const { id: lastOrderId } = await prisma.order.findFirst({
        orderBy: {
            id: 'desc',
        },
        select: {
            id: true,
        },
    });

    // 10개의 주문 데이터 생성
    for (let i = 0; i < 500000; i++) {
        const userId = users[0].id;
        const { id: productId, price } = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1~3개 랜덤 수량
        const totalAmount = price * quantity;
        const date = dateList[Math.floor(Math.random() * dateList.length)];

        const orderId = lastOrderId + (i + 1);

        // order 데이터
        orders.push({
            id: orderId,
            user_id: userId,
            coupon_id: 0,
            total_amount: totalAmount,
            discount_amount: 0,
            final_amount: totalAmount,
            status: orderStatusList[Math.floor(Math.random() * orderStatusList.length)],
            created_at: date,
            updated_at: date,
        });

        // orderItem 데이터
        orderItems.push({
            order_id: orderId,
            product_id: productId,
            quantity: quantityList[Math.floor(Math.random() * quantityList.length)],
            price,
            created_at: date,
            updated_at: date,
        });
    }

    // Order CSV 파일 생성
    const orderCsvHeader =
        'id,user_id,coupon_id,total_amount,discount_amount,final_amount,status,created_at,updated_at\n';
    const orderCsvContent = orders
        .map(
            (order) =>
                `${order.id},${order.user_id},${order.coupon_id},${order.total_amount},${order.discount_amount},${order.final_amount},${order.status},${order.created_at},${order.updated_at}`,
        )
        .join('\n');

    // OrderItem CSV 파일 생성
    const orderItemCsvHeader = 'id,order_id,product_id,quantity,price,created_at,updated_at\n';
    const orderItemCsvContent = orderItems
        .map(
            (item) =>
                `${item.order_id},${item.order_id},${item.product_id},${item.quantity},${item.price},${item.created_at},${item.updated_at}`,
        )
        .join('\n');

    // 파일 저장
    fs.writeFileSync(path.join(__dirname, 'orders_bulk.csv'), orderCsvHeader + orderCsvContent);
    fs.writeFileSync(
        path.join(__dirname, 'order_items_bulk.csv'),
        orderItemCsvHeader + orderItemCsvContent,
    );

    console.log('주문 데이터 CSV 파일이 생성되었습니다.');
}

(async () => {
    await initTable();
    // await createOrderMockDataCsv();
    // await createProductMockData();
    // await createUserMockData();
    // await createCouponMockData();
    // await createOrderMockData();
})();
