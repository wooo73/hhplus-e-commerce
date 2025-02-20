import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
    constructor(
        @Inject('KAFKA_CLIENT')
        private readonly kafkaClient: ClientKafka,
    ) {}

    publishMessage(message: string) {
        return this.kafkaClient.emit('kafkaTest', { message });
    }

    printMessage(payload) {
        console.log(JSON.stringify(payload));
    }
}
