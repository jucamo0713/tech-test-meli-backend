import { Reflector } from '@nestjs/core';
import { CallHandler, ExecutionContext, Logger } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { LoggerInterceptor } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/logger/logger.interceptor';
import { LoggerInterceptorConstants } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/logger/logger.interceptor.constants';

describe('LoggerInterceptor', () => {
    let interceptor: LoggerInterceptor;
    let reflector: Reflector;
    const requestPost = {
        body: { key: 'value' },
        method: 'POST',
        query: { page: 1 },
    };
    const requestGet = {
        method: 'GET',
        query: { page: 1 },
    };
    const mockContext = {
        getClass: jest.fn(
            /**
             * Mocking the class to return a test class.
             * This is a placeholder and can be replaced with any class.
             * In a real scenario, this would be the class of the controller or handler being tested.
             * @returns A test class.
             */
            () => class TestClass {},
        ),
        getHandler: jest.fn(() => function testHandler() {}),
        getType: jest.fn(() => 'http'),
        switchToHttp: jest.fn(() => ({
            getRequest: jest.fn(() => requestPost),
        })),
    } as unknown as ExecutionContext;

    const mockCallHandler: CallHandler = {
        handle: jest.fn(() => of({ success: true })),
    };

    beforeEach(() => {
        reflector = {
            get: jest.fn(),
        } as unknown as Reflector;

        interceptor = new LoggerInterceptor(reflector);

        jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
        jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
        jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('intercept', () => {
        it('should log request and response if all flags are true', (done) => {
            jest.spyOn(reflector, 'get').mockImplementation(() => {
                return false;
            });

            const spyLog = jest.spyOn(Logger.prototype, 'log');

            void interceptor.intercept(mockContext, mockCallHandler).then((value) => {
                value.subscribe((result) => {
                    expect(result).toEqual({ success: true });
                    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('INIT ::'));
                    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('FINISH ::'));
                    done();
                });
            });
        });

        it('should skip logging request if printRequest is false', (done) => {
            jest.spyOn(reflector, 'get').mockImplementation((key) => {
                return key === LoggerInterceptorConstants.DONT_PRINT_REQ_KEY;
            });

            const spyLog = jest.spyOn(Logger.prototype, 'log');

            void interceptor.intercept(mockContext, mockCallHandler).then((value) => {
                value.subscribe((result) => {
                    expect(result).toEqual({ success: true });
                    expect(spyLog).toHaveBeenCalledWith(expect.not.stringContaining('data:'));
                    done();
                });
            });
        });

        it('should skip logging response if printResponse is false', (done) => {
            jest.spyOn(reflector, 'get').mockImplementation((key) => {
                return key === LoggerInterceptorConstants.DONT_PRINT_RES_KEY;
            });

            const spyLog = jest.spyOn(Logger.prototype, 'log');

            void interceptor.intercept(mockContext, mockCallHandler).then((value) => {
                value.subscribe((result) => {
                    expect(result).toEqual({ success: true });
                    expect(spyLog).toHaveBeenCalledWith(expect.not.stringContaining('response:'));
                    done();
                });
            });
        });

        it('should not log anything if printLogs is false', (done) => {
            jest.spyOn(reflector, 'get').mockImplementation((key) => {
                return key === LoggerInterceptorConstants.DONT_PRINT_LOGS_KEY;
            });

            const spyLog = jest.spyOn(Logger.prototype, 'log');

            void interceptor.intercept(mockContext, mockCallHandler).then((value) => {
                value.subscribe((result) => {
                    expect(result).toEqual({ success: true });
                    expect(spyLog).not.toHaveBeenCalled();
                    done();
                });
            });
        });
        it('should log an error if the observable throws', (done) => {
            const mockError = new Error('Something went wrong');
            jest.spyOn(reflector, 'get').mockReturnValue(false);

            const spyErrorLog = jest.spyOn(Logger.prototype, 'error');

            const errorCallHandler: CallHandler = {
                handle: jest.fn(() => {
                    return new Observable((subscriber) => {
                        subscriber.error(mockError);
                    });
                }),
            };

            void interceptor.intercept(mockContext, errorCallHandler).then((result$) => {
                result$.subscribe({
                    error: (err) => {
                        expect(err).toBe(mockError);
                        expect(spyErrorLog).toHaveBeenCalledWith(expect.stringContaining('ERROR ::'));
                        done();
                    },
                });
            });
        });
    });
    describe('resolveRequests', () => {
        it('should throw an error if types is not http', async () => {
            const mockWsContext = {
                ...mockContext,
                getType: jest.fn(() => 'ws'),
            } as unknown as ExecutionContext;

            await expect(interceptor.intercept(mockWsContext, mockCallHandler)).rejects.toThrow(
                'Context Not implemented',
            );
        });
        it('should return only query if method is GET', async () => {
            const getRequestContext = {
                ...mockContext,
                switchToHttp: jest.fn(() => ({
                    getRequest: jest.fn(() => requestGet),
                })),
            } as unknown as ExecutionContext;

            jest.spyOn(reflector, 'get').mockImplementation(() => false);

            const result$ = await interceptor.intercept(getRequestContext, mockCallHandler);
            result$.subscribe(() => {
                void expect(LoggerInterceptor['resolveRequests'](getRequestContext)).resolves.toEqual({
                    query: requestGet.query,
                });
            });
        });

        it('should return body and query if method is not GET', async () => {
            const postRequestContext = {
                ...mockContext,
                switchToHttp: jest.fn(() => ({
                    getRequest: jest.fn(() => requestPost),
                })),
            } as unknown as ExecutionContext;

            jest.spyOn(reflector, 'get').mockImplementation(() => false);

            const result$ = await interceptor.intercept(postRequestContext, mockCallHandler);
            result$.subscribe(() => {
                void expect(LoggerInterceptor['resolveRequests'](postRequestContext)).resolves.toEqual({
                    body: requestPost.body,
                    query: requestPost.query,
                });
            });
        });
    });
});
