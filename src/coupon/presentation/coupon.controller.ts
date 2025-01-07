import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CouponService } from '../domain/coupon.service';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { AvailableCouponResponseDto, UserCouponResponseDto } from './dto/coupon.response.dto';

@Controller('coupon')
@ApiTags('Coupon')
export class CouponController {
    constructor(private readonly couponService: CouponService) {}

    @Get('/available')
    @ApiOperation({
        summary: '발급 가능한 쿠폰 목록 조회',
        description: '현재 사용자가 발급받을 수 있는 쿠폰 목록을 조회합니다.',
    })
    @ApiOkResponse({
        description: '발급 가능한 쿠폰 목록',
        type: [AvailableCouponResponseDto],
    })
    async getAvailableCoupons(@Query('userId') userId: number) {
        return await this.couponService.getAvailableCoupons(userId);
    }

    @Post(':couponId/issue')
    @ApiOperation({
        summary: '쿠폰 발급',
        description: '사용자에게 쿠폰을 발급합니다.',
    })
    @ApiOkResponse({
        description: '발급된 쿠폰',
        type: UserCouponResponseDto,
    })
    @ApiBadRequestResponse({ description: '비정상 쿠폰입니다.' })
    @ApiConflictResponse({ description: '발급 수량이 초과되었습니다.' })
    async issueCoupon(@Param('couponId') couponId: string, @Query('userId') userId: string) {
        return {
            id: 1,
            name: '쿠폰1',
            discount_type: 'FIXED_AMOUNT',
            discount_value: 2_000,
            status: true,
            start_at: new Date(),
            end_at: new Date(),
        };
    }

    @Get('user/:userId')
    @ApiOperation({
        summary: '사용자 쿠폰 목록 조회',
        description: '사용자가 보유한 쿠폰 목록을 조회합니다.',
    })
    @ApiOkResponse({
        description: '사용자 쿠폰 목록',
        type: [UserCouponResponseDto],
    })
    async getUserCoupons(@Param('userId') userId: string) {
        return [
            {
                id: 1,
                name: '쿠폰1',
                discount_type: 'FIXED_AMOUNT',
                discount_value: 2_000,
                status: true,
                start_at: new Date(),
                end_at: new Date(),
            },
        ];
    }
}
