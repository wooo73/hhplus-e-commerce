import { Module } from '@nestjs/common';
import { UserService } from './domain/user.service';
import { UserController } from './presentation/user.controller';

@Module({
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
