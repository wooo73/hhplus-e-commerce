import { Module } from '@nestjs/common';
import { OrderService } from './application/order.service';
import { OrderController } from './interface/order.controller';

@Module({
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
