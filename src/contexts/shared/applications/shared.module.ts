import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PidMiddleware } from '@shared/infrastructure/driven-adapters/nestjs/middlewares/pid.middleware';
import { AsyncContextMiddleware } from '@shared/infrastructure/driven-adapters/nestjs/middlewares/async-context.middleware';
import { SharedHttpEntryPoint } from '@shared/infrastructure/entry-points/http/shared-http.entry-point';
import { LoggerInterceptor } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/logger/logger.interceptor';
import { TimeoutInterceptor } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/timeout/timeout.interceptor';
import { HttpExceptionFilter } from '@shared/infrastructure/driven-adapters/nestjs/filters/http.exception-filter';
import { CqrsModule } from '@nestjs/cqrs';
import SharedProviders from '@shared/applications/providers';
import { ThrottlerModule } from '@nestjs/throttler';
import process from 'node:process';

/**
 * The `SharedModule` is a globally accessible module in a NestJS application that centralizes shared services and
 * utilities, providing them across the entire application. It includes logging, CQRS (Command Query Responsibility
 * Segregation) handling, request timeout management, HTTP exception filtering, and request/response logging.
 */
@Global()
@Module({
    controllers: [SharedHttpEntryPoint],
    exports: [LoggerInterceptor, TimeoutInterceptor, HttpExceptionFilter, ...SharedProviders],
    imports: [
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    limit: Number(process.env.RATE_LIMITER_COUNT),
                    ttl: Number(process.env.RATE_LIMITER_TTL),
                },
            ],
        }),
        CqrsModule.forRoot(),
    ],
    providers: [LoggerInterceptor, TimeoutInterceptor, HttpExceptionFilter, ...SharedProviders],
})
export class SharedModule implements NestModule {
    /**
     * Configures the middleware for the NestJS application.
     * @param consumer - The middleware consumer to apply the middleware to.
     */
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(PidMiddleware, AsyncContextMiddleware).forRoutes('*path');
    }
}
