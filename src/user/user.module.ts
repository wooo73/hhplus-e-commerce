import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { UserController } from './interface/user.controller';

@Module({
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
