import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiParam,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiBody,
} from '@nestjs/swagger';
import { UserChargePointRequestDto } from '../presentation/dto/user.request.dto';
import { User } from '../domain/user';

export function GetUserBalanceSwagger() {
    return applyDecorators(
        ApiOperation({ summary: '잔액 조회', description: '사용자의 잔액을 조회합니다.' }),
        ApiParam({ type: String, name: 'userId', description: '사용자 ID' }),
        ApiOkResponse({ type: User }),
        ApiNotFoundResponse({ description: '사용자를 찾을 수 없습니다.' }),
    );
}

export function ChargeUserBalanceSwagger() {
    return applyDecorators(
        ApiOperation({ summary: '잔액 충전', description: '사용자의 잔액을 충전합니다.' }),
        ApiParam({ type: String, name: 'userId', description: '사용자 ID' }),
        ApiBody({ type: UserChargePointRequestDto }),
        ApiOkResponse({
            type: User,
        }),
        ApiNotFoundResponse({ description: '사용자를 찾을 수 없습니다.' }),
    );
}
