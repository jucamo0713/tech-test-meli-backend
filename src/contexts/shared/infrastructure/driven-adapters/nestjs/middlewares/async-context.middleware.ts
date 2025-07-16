import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PID_HEADER } from '@shared/infrastructure/driven-adapters/nestjs/middlewares/pid.middleware';
import { AsyncRequestContext } from '@shared/domain/model/async-request-context';

/**
 * Middleware that sets the asynchronous request context for each request.
 */
@Injectable()
export class AsyncContextMiddleware implements NestMiddleware {
    /**
     * Sets PID it in the asynchronous request context.
     * @param req - Incoming HTTP request.
     * @param _ - Outgoing HTTP response.
     * @param next - Function to pass control to the next middleware.
     */
    use(req: Request, _: Response, next: NextFunction): void {
        AsyncRequestContext.setData(
            {
                pid: req.headers[PID_HEADER]! as string,
            },
            next,
        );
    }
}
