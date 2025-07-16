import { Controller, Get } from '@nestjs/common';
import { SharedSwaggerConstants } from '@shared/infrastructure/entry-points/http/constants/shared-swagger.constants';
import { ApiTags } from '@nestjs/swagger';
import { SharedHttpUriConstants } from '@shared/infrastructure/entry-points/http/constants/shared-http-uri.constants';
import { HttpDefaultResponse } from '@shared/infrastructure/entry-points/http/responses/http-default.response';
import { SwaggerEndpointDecorator } from '@shared/infrastructure/driven-adapters/swagger/swagger-endpoint.decorator';

/**
 * `SharedHttpEntryPoint` is a controller that handles shared HTTP requests.
 */
@Controller(SharedHttpUriConstants.PREFIX)
@ApiTags(SharedSwaggerConstants.API_TAG)
export class SharedHttpEntryPoint {
    /**
     * This endpoint is used for health checks.
     * It returns a simple message indicating that the health check passed.
     * @returns An object containing a message and status.
     */
    @Get(SharedHttpUriConstants.HEALTH_CHECK_URI)
    @SwaggerEndpointDecorator({
        description: SharedSwaggerConstants.HEALTH_CHECK_DESCRIPTION,
        requireAuth: false,
        response: { type: HttpDefaultResponse },
        summary: SharedSwaggerConstants.HEALTH_CHECK_SUMMARY,
    })
    async healthCheck(): Promise<HttpDefaultResponse> {
        return new HttpDefaultResponse();
    }
}
