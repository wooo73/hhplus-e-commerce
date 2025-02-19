import { Body, Controller, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post('publish')
    async publishTest(@Body() body: { message: string }) {
        return this.appService.publishMessage(body.message);
    }

    @MessagePattern('kafkaTest')
    consumer(@Payload() payload) {
        return this.appService.printMessage(payload);
    }
}
