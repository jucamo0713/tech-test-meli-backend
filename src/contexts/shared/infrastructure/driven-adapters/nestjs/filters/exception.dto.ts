import { HttpStatus } from '@nestjs/common';

/**
 * Represents the structure of an error response.
 */
export class ExceptionDto {
    /**
     * Indicates whether the response is successful (always false for error responses).
     */
    success: false = false as const;

    /**
     * The timestamp when the error response occurred.
     */
    timestamp: string = '';

    /**
     * The HTTP status code of the error response.
     */
    httpStatusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    /**
     * The message describing the error.
     */
    message: string = '';
    /**
     * PID of the request.
     */
    pid: string = '';

    /**
     * The path of the request that caused the error.
     */
    location?: string;
}
