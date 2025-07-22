import { PID_HEADER, PidMiddleware } from '@shared/infrastructure/driven-adapters/nestjs/middlewares/pid.middleware';
import { v4 as uuid } from 'uuid';
import { Request, Response } from 'express';

jest.mock('uuid');

describe('PidMiddleware', () => {
    let middleware: PidMiddleware;

    beforeEach(() => {
        middleware = new PidMiddleware();
        jest.clearAllMocks();
    });

    it('should reuse existing PID in request headers and set it in response', () => {
        const req = { headers: { [PID_HEADER]: 'existing-pid' } };
        const res = { setHeader: jest.fn() };
        const next = jest.fn();

        middleware.use(req as unknown as Request, res as unknown as Response, next);

        expect(req.headers[PID_HEADER]).toBe('existing-pid');
        expect(res.setHeader).toHaveBeenCalledWith(PID_HEADER, 'existing-pid');
        expect(next).toHaveBeenCalled();
    });

    it('should generate a new PID if not present and set it in both request and response', () => {
        const generatedPid = 'new-generated-pid';
        (uuid as jest.Mock).mockReturnValue(generatedPid);

        const req: { headers: Record<string, unknown> } = { headers: {} };
        const res = { setHeader: jest.fn() };
        const next = jest.fn();

        middleware.use(req as unknown as Request, res as unknown as Response, next);

        expect(uuid).toHaveBeenCalled();
        expect(req.headers[PID_HEADER]).toBe(generatedPid);
        expect(res.setHeader).toHaveBeenCalledWith(PID_HEADER, generatedPid);
        expect(next).toHaveBeenCalled();
    });
});
