import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
    constructor(
        @Inject('KAFKA_CLIENT')
        private readonly kafkaClient: ClientKafka,
    ) {}

    publish(topic: string, message: any) {
        this.kafkaClient.emit(topic, message);
    }
}
