import { Module } from '@nestjs/common';
import { UserService } from './domain/user.service';
import { UserController } from './presentation/user.controller';
import { USER_REPOSITORY } from './domain/user.repository';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';
import { RedisModule } from '../database/redis/redis.module';

@Module({
    imports: [RedisModule],
    controllers: [UserController],
    providers: [UserService, { provide: USER_REPOSITORY, useClass: UserPrismaRepository }],
    exports: [UserService, { provide: USER_REPOSITORY, useClass: UserPrismaRepository }],
})
export class UserModule {}
