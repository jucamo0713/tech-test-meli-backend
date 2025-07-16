import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
    RequestTimeoutException,
} from '@nestjs/common';
import { catchError, Observable, throwError, timeout, TimeoutError } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { TimeoutInterceptorConstants } from './timeout.interceptor.constants';
import * as process from 'node:process';

/**
 * Interceptor for handling timeouts in method calls.
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    private logger: Logger = new Logger(TimeoutInterceptor.name);

    /**
     * @param reflector The reflector service.
     */
    constructor(private readonly reflector: Reflector) {}

    /**
     * Intercepts the method call and adds timeout handling.
     * @param context - The execution context.
     * @param next - The call handler.
     * @returns The observable with timeout handling.
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const cancelTimeout: boolean = this.reflector.get<boolean>(
            TimeoutInterceptorConstants.CANCEL_TIMEOUT_METADATA_KEY,
            context.getHandler(),
        );
        if (cancelTimeout) {
            return next.handle();
        } else {
            const timeMs: number =
                this.reflector.get<number>(TimeoutInterceptorConstants.TIMEOUT_METADATA_KEY, context.getHandler()) ??
                Number(process.env.DEFAULT_TIMEOUT_MS);
            this.logger.log(`[${context.getHandler().name}] - TIMEOUT SET ON ${timeMs}`);
            return next.handle().pipe(
                timeout(timeMs),
                catchError((err) => {
                    if (err instanceof TimeoutError) {
                        new Logger(context.getHandler().name).error(`${err.message} exceed ${timeMs}`);
                        return throwError(() => new RequestTimeoutException());
                    }
                    return throwError(() => err);
                }),
            );
        }
    }
}
