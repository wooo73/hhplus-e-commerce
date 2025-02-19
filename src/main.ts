import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './database/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/exception/exception';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get(ConfigService);

    app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: config.get('KAFKA_CLIENT_ID'),
                brokers: [config.get('KAFKA_BROKER')],
            },
            consumer: {
                groupId: config.get('KAFKA_SERVER_GROUP_ID'),
            },
        },
    });

    await app.startAllMicroservices();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.useGlobalFilters(new GlobalExceptionFilter());

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks();

    const options = new DocumentBuilder()
        .setTitle('E-commerce API')
        .setDescription('API for e-commerce application')
        .setVersion('1.0')
        .addServer('http://localhost:3030/', 'Local server')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(3030);
}
bootstrap();
