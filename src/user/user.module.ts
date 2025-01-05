import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { UserController } from './presentation/user.controller';
import { USER_REPOSITORY } from './application/user.repository';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, { provide: USER_REPOSITORY, useClass: UserPrismaRepository }],
})
export class UserModule {}
