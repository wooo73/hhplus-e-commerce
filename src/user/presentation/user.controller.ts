import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../application/user.service';
import {
    ApiBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { UserChargePointRequestDto } from './dto/user.request.dto';
import { UserBalanceResponseDto } from './dto/user.response.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':userId/balance')
    @ApiOperation({ summary: '잔액 조회', description: '사용자의 잔액을 조회합니다.' })
    @ApiParam({ type: String, name: 'userId', description: '사용자 ID' })
    @ApiOkResponse({
        type: UserBalanceResponseDto,
    })
    @ApiNotFoundResponse({ description: '사용자를 찾을 수 없습니다.' })
    async getUserBalance(@Param('userId') userId: string) {
        return { userId: 1, balance: 10_000 };
    }

    @Post(':userId/balance/charge')
    @ApiOperation({ summary: '잔액 충전', description: '사용자의 잔액을 충전합니다.' })
    @ApiParam({ type: String, name: 'userId', description: '사용자 ID' })
    @ApiBody({ type: UserChargePointRequestDto })
    @ApiOkResponse({
        type: UserBalanceResponseDto,
    })
    @ApiNotFoundResponse({ description: '사용자를 찾을 수 없습니다.' })
    async chargePoint(
        @Param('userId') userId: string,
        @Body() UserChargePointRequestDto: UserChargePointRequestDto,
    ) {
        return { id: 1, balance: 15_000 };
    }
}
