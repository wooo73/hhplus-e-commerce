import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_CLIENT',
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: configService.get('KAFKA_CLIENT_ID'),
                            brokers: [configService.get('KAFKA_BROKER')],
                        },
                        consumer: {
                            groupId: configService.get('KAFKA_CLIENT_GROUP_ID'),
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class KafkaModule {}
