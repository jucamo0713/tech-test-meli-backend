import { ArgumentsHost, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from '@shared/infrastructure/driven-adapters/nestjs/filters/http.exception-filter';

jest.mock('@shared/domain/model/async-request-context', () => ({
    AsyncRequestContext: {
        get: jest.fn().mockReturnValue('test-pid'),
    },
}));

jest.mock('@shared/domain/usecase/utils/error.utils', () => ({
    ErrorUtils: {
        resolveErrorMessage: jest.fn((e: Error) => e.message),
    },
}));

describe('HttpExceptionFilter', () => {
    let filter: HttpExceptionFilter;
    let mockResponse: Response;
    let mockHost: ArgumentsHost;

    beforeEach(() => {
        filter = new HttpExceptionFilter();

        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;

        mockHost = {
            getType: jest.fn().mockReturnValue('http'),
            switchToHttp: jest.fn().mockReturnValue({
                getResponse: () => mockResponse,
            }),
        } as unknown as ArgumentsHost;

        jest.spyOn(filter['logger'], 'error').mockImplementation(() => {});
    });

    it('should handle HttpException correctly', () => {
        const httpException = new HttpException('Not Found', HttpStatus.NOT_FOUND);
        filter.catch(httpException, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                httpStatusCode: HttpStatus.NOT_FOUND,
                location: expect.any(String),
                message: 'Not Found',
            }),
        );
    });

    it('should handle unknown errors correctly', () => {
        const unknownException = new Error('Unexpected failure');
        filter.catch(unknownException, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                location: expect.any(String),
                message: 'Unexpected failure',
            }),
        );
    });

    it('should throw InternalServerErrorException if protocol is not http', () => {
        const unknownException = new Error('Fail');
        const grpcHost: ArgumentsHost = {
            getType: jest.fn().mockReturnValue('rpc'),
        } as unknown as ArgumentsHost;

        expect(() => filter.catch(unknownException, grpcHost)).toThrow(InternalServerErrorException);
    });

    it('should assign INTERNAL_SERVER_ERROR if message is empty', () => {
        const error = new Error('');
        filter.catch(error, mockHost);

        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'INTERNAL_SERVER_ERROR',
            }),
        );
    });

    it('should log every exception with logger', () => {
        const error = new Error('Error for logging');
        const loggerSpy = jest.spyOn(filter['logger'], 'error');

        filter.catch(error, mockHost);

        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Error for logging'));
        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR ::'));
    });
});
