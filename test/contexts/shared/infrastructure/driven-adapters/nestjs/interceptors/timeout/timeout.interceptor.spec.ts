import { ExecutionContext, RequestTimeoutException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of, throwError, TimeoutError } from 'rxjs';
import * as process from 'node:process';
import { TimeoutInterceptor } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/timeout/timeout.interceptor';
import { TimeoutInterceptorConstants } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/timeout/timeout.interceptor.constants';

jest.mock('@nestjs/common', () => {
    const actual = jest.requireActual('@nestjs/common');
    return {
        ...actual,
        Logger: jest.fn().mockImplementation(() => ({
            error: jest.fn(),
            log: jest.fn(),
        })),
    };
});

describe('TimeoutInterceptor', () => {
    let interceptor: TimeoutInterceptor;
    let reflector: Reflector;
    let context: ExecutionContext;
    let next: { handle: jest.Mock };

    beforeEach(() => {
        reflector = {
            get: jest.fn(),
        } as unknown as Reflector;

        interceptor = new TimeoutInterceptor(reflector);

        context = {
            getHandler: jest.fn().mockReturnValue(() => {}),
        } as unknown as ExecutionContext;

        next = {
            handle: jest.fn(),
        };
    });

    it('should skip timeout when CancelTimeoutDecorator is true', () => {
        (reflector.get as jest.Mock).mockReturnValueOnce(true);
        const response$ = of('no timeout');
        next.handle.mockReturnValue(response$);

        const result$ = interceptor.intercept(context, next);
        expect(result$).toBe(response$);
        expect(reflector.get).toHaveBeenCalledWith(
            TimeoutInterceptorConstants.CANCEL_TIMEOUT_METADATA_KEY,
            context.getHandler(),
        );
    });

    it('should apply timeout with value from metadata', (done) => {
        const customTimeout = 100;
        (reflector.get as jest.Mock)
            .mockReturnValueOnce(false) // cancelTimeout = false
            .mockReturnValueOnce(customTimeout); // timeout metadata
        next.handle.mockReturnValue(of('response'));

        const result$ = interceptor.intercept(context, next);
        result$.subscribe((value) => {
            expect(value).toBe('response');
            done();
        });
    });

    it('should throw RequestTimeoutException if timeout is exceeded', (done) => {
        const customTimeout = 10;
        (reflector.get as jest.Mock)
            .mockReturnValueOnce(false) // cancelTimeout = false
            .mockReturnValueOnce(customTimeout); // timeout metadata
        next.handle.mockReturnValue(throwError(() => new TimeoutError()));

        const result$ = interceptor.intercept(context, next);

        result$.subscribe({
            error: (err) => {
                expect(err).toBeInstanceOf(RequestTimeoutException);
                done();
            },
        });
    });

    it('should rethrow error if it is not TimeoutError', (done) => {
        const error = new Error('unexpected');
        (reflector.get as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(200);
        next.handle.mockReturnValue(throwError(() => error));

        const result$ = interceptor.intercept(context, next);

        result$.subscribe({
            error: (err) => {
                expect(err).toBe(error);
                done();
            },
        });
    });

    it('should use default timeout if metadata not set', (done) => {
        const defaultTimeout = 1500;
        process.env.DEFAULT_TIMEOUT_MS = defaultTimeout.toString();

        (reflector.get as jest.Mock)
            .mockReturnValueOnce(false) // cancelTimeout = false
            .mockReturnValueOnce(undefined); // no timeout metadata

        next.handle.mockReturnValue(of('OK'));

        const result$ = interceptor.intercept(context, next);

        result$.subscribe((res) => {
            expect(res).toBe('OK');
            done();
        });
    });
});
