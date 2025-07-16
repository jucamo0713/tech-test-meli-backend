import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { ExceptionDto } from './exception.dto';
import { ExceptionBase } from '@shared/domain/model/exceptions/exception-base';
import { Response } from 'express';
import { ErrorUtils } from '@shared/domain/usecase/utils/error.utils';
import { AsyncRequestContext } from '@shared/domain/model/async-request-context';

/**
 * Message that is thrown by default if there is no exception.
 */
const INTERNAL_SERVER_ERROR: string = 'INTERNAL_SERVER_ERROR';

/**
 * Exception filter for handling NestJS exceptions and providing standardized error response.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private logger: Logger = new Logger(HttpExceptionFilter.name);

    /**
     * Handles exceptions caught by NestJS and provides standardized error response.
     * @param exception - The exception caught by NestJS.
     * @param host - The context host of the execution.
     */
    public catch(exception: Error, host: ArgumentsHost) {
        this.logger.error(JSON.stringify(exception));
        const response: ExceptionDto = new ExceptionDto();
        response.timestamp = Date.now().toString();
        response.pid = AsyncRequestContext.get('pid') ?? 'undefined';
        if (exception instanceof ExceptionBase) {
            this.logger.error(`[${this.catch.name}] ERROR :: CONTROLLED EXCEPTION OCCURRED IN ${exception.location}`);
            response.httpStatusCode = exception.getStatus();
            response.message = exception.message;
            response.location = exception.location;
        } else if (exception instanceof HttpException) {
            this.logger.error(`[${this.catch.name}] ERROR :: CONTROLLED EXCEPTION OCCURRED `);
            response.httpStatusCode = exception.getStatus();
            response.message = ErrorUtils.resolveErrorMessage(exception);
            response.location = exception.stack;
        } else {
            this.logger.error(`[${this.catch.name}] ERROR :: UNCONTROLLED EXCEPTION OCCURRED`);
            response.message = ErrorUtils.resolveErrorMessage(exception);
            response.httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            response.location = exception.stack;
        }
        if (!response.message) response.message = INTERNAL_SERVER_ERROR;
        try {
            switch (host.getType()) {
                case 'http':
                    host.switchToHttp().getResponse<Response>().status(response.httpStatusCode).json(response);
                    break;
                default:
                    throw new InternalServerErrorException(`PROTOCOL ${host.getType()} HAS NOT IMPLEMENTED`);
            }
        } finally {
            this.logger.error(`ERROR :: ${JSON.stringify(response)}`);
        }
    }
}
