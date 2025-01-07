import { Injectable } from '@nestjs/common';
import { Coupon } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CouponRepository } from '../domain/coupon.repository';
import { CouponStatus } from 'src/common/coupon.status';

@Injectable()
export class CouponPrismaRepository implements CouponRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getUserCouponIds(userId: number): Promise<{ couponId: number }[]> {
        return await this.prisma.userCoupon.findMany({
            where: { userId },
            select: { couponId: true },
        });
    }

    async getAvailableCoupons(couponIds: number[], nowDate: Date): Promise<Coupon[]> {
        return await this.prisma.coupon.findMany({
            where: {
                status: CouponStatus.AVAILABLE,
                id: { notIn: couponIds },
                endAt: { gte: nowDate },
            },
        });
    }
}
