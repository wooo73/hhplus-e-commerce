import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserChargePointRequestDto } from './dto/user.request.dto';
import { GetUserBalanceSwagger, ChargeUserBalanceSwagger } from '../swagger/user.swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':userId/balance')
    @GetUserBalanceSwagger()
    async getUserBalance(@Param('userId') userId: number) {
        return await this.userService.getUserBalance(userId);
    }

    @Post(':userId/balance/charge')
    @ChargeUserBalanceSwagger()
    async chargePoint(
        @Param('userId') userId: number,
        @Body() userChargePointRequestDto: UserChargePointRequestDto,
    ) {
        return await this.userService.chargeUserBalance(userId, userChargePointRequestDto);
    }
}
