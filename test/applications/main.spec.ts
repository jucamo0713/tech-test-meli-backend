import { bootstrap } from '../../src/applications/main';
import { AppLogger } from '@shared/infrastructure/driven-adapters/nestjs/logger/app.logger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { LoggerInterceptor } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/logger/logger.interceptor';
import { TimeoutInterceptor } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/timeout/timeout.interceptor';
import { HttpExceptionFilter } from '@shared/infrastructure/driven-adapters/nestjs/filters/http.exception-filter';

jest.mock('../../src/applications/app.module', () => ({
    AppModule: jest.fn(),
}));
jest.mock('@nestjs/core', () => ({
    NestFactory: {
        create: jest.fn(),
    },
}));

jest.mock('@nestjs/swagger', () => {
    return {
        DocumentBuilder: jest.fn().mockImplementation(() => ({
            addBearerAuth: jest.fn().mockReturnThis(),
            build: jest.fn().mockReturnValue({}),
            setDescription: jest.fn().mockReturnThis(),
            setTitle: jest.fn().mockReturnThis(),
        })),
        SwaggerModule: {
            createDocument: jest.fn().mockReturnValue({}),
            setup: jest.fn(),
        },
    };
});

import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../../src/applications/app.module';

describe('bootstrap', () => {
    const enableCors = jest.fn();
    const useLogger = jest.fn();
    const flushLogs = jest.fn();
    const useGlobalInterceptors = jest.fn();
    const useGlobalPipes = jest.fn();
    const useGlobalFilters = jest.fn();
    const setGlobalPrefix = jest.fn();
    const listen = jest.fn();
    const get = jest.fn().mockImplementation((token) => {
        if (token === TimeoutInterceptor) return new TimeoutInterceptor(jest.fn() as unknown as Reflector);
        if (token === LoggerInterceptor) return new LoggerInterceptor(jest.fn() as unknown as Reflector);
        if (token === HttpExceptionFilter) return new HttpExceptionFilter();
    });

    const mockApp: Partial<INestApplication> = {
        enableCors,
        flushLogs,
        get,
        listen,
        setGlobalPrefix,
        useGlobalFilters,
        useGlobalInterceptors,
        useGlobalPipes,
        useLogger,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        process.env.APP_GLOBAL_PREFIX = 'api';
        process.env.SWAGGER_TITLE = 'Test API';
        process.env.SWAGGER_DESCRIPTION = 'API description';
        process.env.SWAGGER_PATH = 'docs';
        process.env.PORT = '3000';

        jest.spyOn(NestFactory, 'create').mockResolvedValue(mockApp as INestApplication);
    });

    it('should bootstrap the app and call all setup methods', async () => {
        const result = await bootstrap();

        expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
        expect(result).toBe(mockApp);

        expect(enableCors).toHaveBeenCalled();
        expect(useLogger).toHaveBeenCalledWith(expect.any(AppLogger));
        expect(flushLogs).toHaveBeenCalled();
        expect(useGlobalInterceptors).toHaveBeenCalledWith(
            expect.any(TimeoutInterceptor),
            expect.any(LoggerInterceptor),
        );
        expect(useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
        expect(useGlobalFilters).toHaveBeenCalledWith(expect.any(HttpExceptionFilter));
        expect(setGlobalPrefix).toHaveBeenCalledWith('api');
        expect(listen).toHaveBeenCalledWith('3000');
        expect(SwaggerModule.setup).toHaveBeenCalledWith('docs', mockApp, expect.any(Object));
    });
});
