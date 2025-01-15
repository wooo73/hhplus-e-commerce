import { ApiProperty } from '@nestjs/swagger';

export class UserDomain {
    @ApiProperty({ example: '1', description: '사용자 ID' })
    id: number;

    @ApiProperty({ example: 15_000, description: '사용자 잔액' })
    balance: number;

    @ApiProperty({ example: '2025-01-01', description: '생성일' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '수정일' })
    updatedAt: Date;

    static from({ id, balance, createdAt, updatedAt }) {
        const user = new UserDomain();
        user.id = id;
        user.balance = balance;
        user.createdAt = createdAt;
        user.updatedAt = updatedAt;
        return user;
    }
}
