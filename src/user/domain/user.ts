import { ApiProperty } from '@nestjs/swagger';

export class User {
    @ApiProperty({ example: '1', description: '사용자 ID' })
    id: number;

    @ApiProperty({ example: 15_000, description: '사용자 잔액' })
    balance: number;

    @ApiProperty({ example: '2025-01-01', description: '생성일' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-01', description: '수정일' })
    updatedAt: Date;
}
