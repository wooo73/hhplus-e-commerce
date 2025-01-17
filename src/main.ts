import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './database/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/exception/exception';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.useGlobalFilters(new GlobalExceptionFilter());

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks();

    const options = new DocumentBuilder()
        .setTitle('E-commerce API')
        .setDescription('API for e-commerce application')
        .setVersion('1.0')
        .addServer('http://localhost:3000/', 'Local server')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(3000);
}
bootstrap();
