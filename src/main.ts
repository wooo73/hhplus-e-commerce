import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './database/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/exception/exception';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'kafkaClient',
                brokers: ['localhost:9092'],
            },
            consumer: {
                groupId: 'helloKafka-server',
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
