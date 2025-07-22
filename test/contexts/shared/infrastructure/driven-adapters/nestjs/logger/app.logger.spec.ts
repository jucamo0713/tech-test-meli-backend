import { AsyncRequestContext } from '@shared/domain/model/async-request-context';
import { AppLogger } from '@shared/infrastructure/driven-adapters/nestjs/logger/app.logger';
import { ConsoleLogger } from '@nestjs/common';

jest.mock('@shared/domain/model/async-request-context', () => ({
    AsyncRequestContext: {
        get: jest.fn(),
    },
}));

describe('AppLogger', () => {
    let logger: AppLogger;

    const baseConsoleLoggerMethods = ['log', 'error', 'warn', 'debug', 'verbose'] as const;
    const mockedMethods = {} as Record<(typeof baseConsoleLoggerMethods)[number], jest.SpyInstance>;

    beforeEach(() => {
        logger = new AppLogger();

        for (const method of baseConsoleLoggerMethods) {
            mockedMethods[method] = jest
                .spyOn(ConsoleLogger.prototype, method)
                .mockImplementation((...args: unknown[]) => {
                    return args as unknown;
                });
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each(baseConsoleLoggerMethods)(
        'should call ConsoleLogger.%s with context containing PID when available',
        (method) => {
            const mockPid = 'mock-pid-123';
            (AsyncRequestContext.get as jest.Mock).mockReturnValue(mockPid);

            const baseMessage = 'Test message';
            const baseContext = 'TestContext';
            let calledWithContext;
            if (method === 'error') {
                logger[method](baseMessage, 'trace', baseContext);
                calledWithContext = mockedMethods[method].mock.calls[0][2];
            } else {
                logger[method](baseMessage, baseContext);
                calledWithContext = mockedMethods[method].mock.calls[0][1];
            }
            expect(calledWithContext).toContain(baseContext);
            expect(calledWithContext).toContain(mockPid);
        },
    );

    it.each(baseConsoleLoggerMethods)(
        'should call ConsoleLogger.%s with undefined context if none provided and no PID',
        (method) => {
            (AsyncRequestContext.get as jest.Mock).mockReturnValue(undefined);

            logger[method]('Another message');

            const calledWithContext = mockedMethods[method].mock.calls[0][1];
            expect(calledWithContext).toBeUndefined();
        },
    );

    it('should call ConsoleLogger.error with trace and formatted context', () => {
        const mockPid = 'trace-pid-456';
        (AsyncRequestContext.get as jest.Mock).mockReturnValue(mockPid);

        const spy = jest.spyOn(ConsoleLogger.prototype, 'error');

        logger.error('error-msg', 'stack-trace', 'ErrorCtx');

        expect(spy).toHaveBeenCalledWith('error-msg', 'stack-trace', expect.stringContaining('PID'));
    });
});
