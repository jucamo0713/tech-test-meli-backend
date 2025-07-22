import { Test } from '@nestjs/testing';
import { MiddlewareConsumer } from '@nestjs/common';
import { SharedModule } from '@shared/applications/shared.module';

beforeEach(() => {
    process.env.RATE_LIMITER_COUNT = '10';
    process.env.RATE_LIMITER_TTL = '60';
});

jest.mock('@nestjs/throttler', () => ({
    ThrottlerModule: {
        forRoot: jest.fn(() => 'MockedThrottlerModule'),
    },
}));

jest.mock('@nestjs/cqrs', () => ({
    CqrsModule: {
        forRoot: jest.fn(() => 'MockedCqrsModule'),
    },
}));

// Mocks básicos para middlewares y providers
jest.mock('@shared/infrastructure/driven-adapters/nestjs/middlewares/pid.middleware', () => ({
    PidMiddleware: jest.fn(),
}));

jest.mock('@shared/infrastructure/driven-adapters/nestjs/middlewares/async-context.middleware', () => ({
    AsyncContextMiddleware: jest.fn(),
}));

jest.mock('@shared/infrastructure/driven-adapters/nestjs/interceptors/logger/logger.interceptor', () => ({
    LoggerInterceptor: jest.fn(),
}));

jest.mock('@shared/infrastructure/driven-adapters/nestjs/interceptors/timeout/timeout.interceptor', () => ({
    TimeoutInterceptor: jest.fn(),
}));

jest.mock('@shared/infrastructure/driven-adapters/nestjs/filters/http.exception-filter', () => ({
    HttpExceptionFilter: jest.fn(),
}));

jest.mock('@shared/applications/providers', () => []); // SharedProviders

describe('SharedModule', () => {
    it('should compile successfully with mocked dependencies', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [SharedModule],
        }).compile();

        expect(moduleRef).toBeDefined();
    });

    it('should configure middlewares correctly', () => {
        const consumer = {
            apply: jest.fn(() => ({
                forRoutes: jest.fn(),
            })),
        } as unknown as MiddlewareConsumer;

        const module = new SharedModule();
        module.configure(consumer);

        expect(consumer.apply).toHaveBeenCalled();
    });
});
