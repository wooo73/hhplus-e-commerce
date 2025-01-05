import { Module } from '@nestjs/common';
import { OrderService } from './application/order.service';
import { OrderController } from './presentation/order.controller';

@Module({
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
