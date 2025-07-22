import 'reflect-metadata';
import { SharedSwaggerConstants } from '@shared/infrastructure/entry-points/http/constants/shared-swagger.constants';
import { HttpDefaultResponse } from '@shared/infrastructure/entry-points/http/responses/http-default.response';
import { SharedHttpEntryPoint } from '@shared/infrastructure/entry-points/http/shared-http.entry-point';
import { Test, TestingModule } from '@nestjs/testing';
import * as swaggerDecorator from '@shared/infrastructure/driven-adapters/swagger/swagger-endpoint.decorator';

// Mock del decorador para poder espiar su uso
jest.mock('@shared/infrastructure/driven-adapters/swagger/swagger-endpoint.decorator', () => ({
    SwaggerEndpointDecorator: jest.fn(() => () => {}),
}));

describe('SharedHttpEntryPoint - Swagger metadata', () => {
    let controller: SharedHttpEntryPoint;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SharedHttpEntryPoint],
        }).compile();

        controller = module.get<SharedHttpEntryPoint>(SharedHttpEntryPoint);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('healthCheck', () => {
        it('should return an instance of HttpDefaultResponse', async () => {
            const response = await controller.healthCheck();
            expect(response).toBeInstanceOf(HttpDefaultResponse);
        });
    });

    it('should apply SwaggerEndpointDecorator to healthCheck', () => {
        expect(swaggerDecorator.SwaggerEndpointDecorator).toHaveBeenCalledWith({
            description: SharedSwaggerConstants.HEALTH_CHECK_DESCRIPTION,
            response: expect.objectContaining({
                type: HttpDefaultResponse,
            }),
            summary: SharedSwaggerConstants.HEALTH_CHECK_SUMMARY,
        });
    });
});
