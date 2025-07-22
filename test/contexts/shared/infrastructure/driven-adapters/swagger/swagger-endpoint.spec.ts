import * as swagger from '@nestjs/swagger';
import * as common from '@nestjs/common';
import { Type } from '@nestjs/common';
import { SwaggerEndpointDecorator } from '@shared/infrastructure/driven-adapters/swagger/swagger-endpoint.decorator';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';

jest.mock('@nestjs/common', () => {
    const actual = jest.requireActual('@nestjs/common');
    return {
        ...actual,
        applyDecorators: jest.fn(() => () => {}),
    };
});
jest.mock('@nestjs/swagger', () => {
    const actual = jest.requireActual('@nestjs/swagger');
    return {
        ...actual,
        ApiOperation: jest.fn().mockImplementation((...data) => actual.ApiOperation(...data)),
        ApiResponse: jest.fn().mockImplementation((...data) => actual.ApiResponse(...data)),
    };
});

describe('SwaggerEndpointDecorator', () => {
    const responseMock: ApiResponseOptions = { type: {} as Type };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should apply ApiOperation, ApiResponse by default', () => {
        const operationSpy = jest.spyOn(swagger, 'ApiOperation');
        const responseSpy = jest.spyOn(swagger, 'ApiResponse');

        SwaggerEndpointDecorator({
            description: 'Test description',
            response: responseMock,
            summary: 'Test summary',
        });

        expect(operationSpy).toHaveBeenCalledWith({
            description: 'Test description',
            summary: 'Test summary',
        });
        expect(responseSpy).toHaveBeenCalledWith(responseMock);

        expect(common.applyDecorators).toHaveBeenCalledTimes(1);
        expect(common.applyDecorators).toHaveBeenCalledWith(
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
        );
    });

    it('should include error messages in description', () => {
        const errors = ['Error one', 'Error two'];
        const expectedDescription =
            'Base description\n\nThis service can return the following error messages:\n- Error one\n- Error two';

        const operationSpy = jest.spyOn(swagger, 'ApiOperation');

        SwaggerEndpointDecorator({
            description: 'Base description',
            errors,
            response: responseMock,
            summary: 'Summary',
        });

        expect(operationSpy).toHaveBeenCalledWith({
            description: expectedDescription,
            summary: 'Summary',
        });
    });
});
