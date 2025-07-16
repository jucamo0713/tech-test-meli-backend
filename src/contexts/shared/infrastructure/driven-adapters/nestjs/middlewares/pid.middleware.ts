import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

/**
 * The header key used for the Process ID (PID).
 */
export const PID_HEADER = 'x-pid';

/**
 * Middleware that ensures each request/response has a unique PID in the `x-pid` header.
 */
@Injectable()
export class PidMiddleware implements NestMiddleware {
    /**
     * Adds a PID to the request and response headers.
     * @param req - Incoming HTTP request.
     * @param res - Outgoing HTTP response.
     * @param next - Function to pass control to the next middleware.
     */
    use(req: Request, res: Response, next: NextFunction): void {
        const pid: string = (req.headers[PID_HEADER] as string) ?? uuid();
        req.headers[PID_HEADER] = pid;
        res.setHeader(PID_HEADER, pid);
        next();
    }
}
