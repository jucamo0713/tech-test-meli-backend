import { SetMetadata } from '@nestjs/common';
import { LoggerDecorator } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/logger/logger.decorator';
import { LoggerInterceptorConstants } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/logger/logger.interceptor.constants';

jest.mock('@nestjs/common', () => {
    const original = jest.requireActual('@nestjs/common');
    return {
        ...original,
        SetMetadata: jest.fn(() => () => {}),
        applyDecorators: jest.fn(
            (...args) =>
                () =>
                    args,
        ),
    };
});

describe('LoggerDecorator', () => {
    const mockSetMetadata = SetMetadata as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should apply default metadata when no options are provided', () => {
        LoggerDecorator();

        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_REQ_KEY, false);
        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_RES_KEY, false);
        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_LOGS_KEY, false);
    });

    it('should apply correct metadata when printRequest is false', () => {
        LoggerDecorator({ printRequest: false });

        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_REQ_KEY, true);
    });

    it('should apply correct metadata when printResponse is false', () => {
        LoggerDecorator({ printResponse: false });

        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_RES_KEY, true);
    });

    it('should apply correct metadata when printLogs is false', () => {
        LoggerDecorator({ printLogs: false });

        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_LOGS_KEY, true);
    });

    it('should apply all correct metadata when all options are set to false', () => {
        LoggerDecorator({
            printLogs: false,
            printRequest: false,
            printResponse: false,
        });

        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_REQ_KEY, true);
        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_RES_KEY, true);
        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_LOGS_KEY, true);
    });

    it('should apply all correct metadata when all options are set to true', () => {
        LoggerDecorator({
            printLogs: true,
            printRequest: true,
            printResponse: true,
        });

        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_REQ_KEY, false);
        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_RES_KEY, false);
        expect(mockSetMetadata).toHaveBeenCalledWith(LoggerInterceptorConstants.DONT_PRINT_LOGS_KEY, false);
    });
});
