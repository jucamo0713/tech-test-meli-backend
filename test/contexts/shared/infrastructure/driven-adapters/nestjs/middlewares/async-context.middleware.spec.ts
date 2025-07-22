import { AsyncRequestContext } from '@shared/domain/model/async-request-context';
import { PID_HEADER } from '@shared/infrastructure/driven-adapters/nestjs/middlewares/pid.middleware';
import { AsyncContextMiddleware } from '@shared/infrastructure/driven-adapters/nestjs/middlewares/async-context.middleware';
import { Request, Response } from 'express';

describe('AsyncContextMiddleware', () => {
    let middleware: AsyncContextMiddleware;

    beforeEach(() => {
        middleware = new AsyncContextMiddleware();
        jest.spyOn(AsyncRequestContext, 'setData').mockImplementation((_data, callback) => callback());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set the PID in AsyncRequestContext and call next()', () => {
        const req = {
            headers: {
                [PID_HEADER]: 'pid-456',
            },
        } as unknown;

        const res = {} as unknown;
        const next = jest.fn();

        middleware.use(req as Request, res as Response, next);

        expect(AsyncRequestContext.setData).toHaveBeenCalledWith({ pid: 'pid-456' }, expect.any(Function));
        expect(next).toHaveBeenCalled();
    });
});
