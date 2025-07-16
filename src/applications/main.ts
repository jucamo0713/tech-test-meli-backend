import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppLogger } from '@shared/infrastructure/driven-adapters/nestjs/logger/app.logger';
import process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerInterceptor } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/logger/logger.interceptor';
import { TimeoutInterceptor } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/timeout/timeout.interceptor';
import { HttpExceptionFilter } from '@shared/infrastructure/driven-adapters/nestjs/filters/http.exception-filter';

/**
 * Bootstrap function to create and start the NestJS application.
 * This function initializes the application and listens to the specified port.
 * @returns A promise that resolves when the application is ready.
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useLogger(new AppLogger());
    app.flushLogs();
    app.useGlobalInterceptors(app.get(TimeoutInterceptor), app.get(LoggerInterceptor));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(app.get(HttpExceptionFilter));
    app.setGlobalPrefix(process.env.APP_GLOBAL_PREFIX!);
    const swaggerConfig = new DocumentBuilder()
        .setTitle(process.env.SWAGGER_TITLE!)
        .setDescription(process.env.SWAGGER_DESCRIPTION!)
        .addBearerAuth()
        .build();
    SwaggerModule.setup(process.env.SWAGGER_PATH!, app, SwaggerModule.createDocument(app, swaggerConfig));
    await app.listen(process.env.PORT!);
    return app;
}

void bootstrap().then(() => {
    const logger = new Logger(bootstrap.name);
    logger.log(`Application is running on: http://localhost:${process.env.PORT!}`);
});
