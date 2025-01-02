import { OmitType } from '@nestjs/swagger';
import { User } from '../domain/user';

export class UserBalanceResponseDto extends OmitType(User, ['createdAt', 'updatedAt'] as const) {}
