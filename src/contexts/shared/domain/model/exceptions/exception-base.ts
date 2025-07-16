import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base class for custom exceptions, extending the HttpException class from NestJS.
 */
export class ExceptionBase extends HttpException {
    /**
     * @param location The location where the exception occurred.
     * @param message A custom message describing the exception.
     * @param status The HTTP status code of the exception.
     * @param originalError The original error that caused this exception, if any.
     */
    constructor(
        public readonly location: string,
        public readonly message: string,
        status: HttpStatus,
        public readonly originalError?: Error,
    ) {
        super({ location, message: message }, status, originalError ? { cause: originalError } : undefined);
    }
}
