import { Controller, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post('publish')
    async publishTest() {
        return this.appService.publishMessage('Hello Kafka!');
    }

    @MessagePattern('kafkaTest')
    consumer(@Payload() payload) {
        return this.appService.printMessage(payload);
    }
}
