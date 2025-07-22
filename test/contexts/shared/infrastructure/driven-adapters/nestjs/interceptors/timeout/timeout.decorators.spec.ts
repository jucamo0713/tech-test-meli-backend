import { SetMetadata } from '@nestjs/common';
import {
    CancelTimeoutDecorator,
    TimeoutDecorator,
} from '@shared/infrastructure/driven-adapters/nestjs/interceptors/timeout/timeout.decorators';
import { TimeoutInterceptorConstants } from '@shared/infrastructure/driven-adapters/nestjs/interceptors/timeout/timeout.interceptor.constants';

jest.mock('@nestjs/common', () => {
    const original = jest.requireActual('@nestjs/common');
    return {
        ...original,
        SetMetadata: jest.fn(() => jest.fn()),
    };
});

describe('TimeoutDecorator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call SetMetadata with correct key and value for TimeoutDecorator', () => {
        const timeout = 3000;

        TimeoutDecorator(timeout);

        expect(SetMetadata).toHaveBeenCalledWith(TimeoutInterceptorConstants.TIMEOUT_METADATA_KEY, timeout);
    });

    it('should call SetMetadata with correct key and value for CancelTimeoutDecorator', () => {
        CancelTimeoutDecorator();

        expect(SetMetadata).toHaveBeenCalledWith(TimeoutInterceptorConstants.CANCEL_TIMEOUT_METADATA_KEY, true);
    });
});
