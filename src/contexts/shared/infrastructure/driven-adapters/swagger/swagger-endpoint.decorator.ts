import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';

/**
 * SwaggerEndpointDecorator is a custom decorator for Swagger documentation in NestJS.
 * It simplifies the process of adding Swagger metadata to endpoint methods.
 * @param args - An object containing the following properties:
 * @param args.description - The description of the endpoint.
 * @param args.response - The response type of the endpoint.
 * @param args.requireAuth - Whether the endpoint requires authentication (default: true).
 * @param args.errors - An array of error messages that the endpoint can return.
 * @param args.summary - The summary of the endpoint.
 * @returns A decorator that can be applied to a method.
 */
export function SwaggerEndpointDecorator({
    description,
    summary,
    requireAuth = true,
    errors,
    response,
}: {
    description: string;
    response: ApiResponseOptions;
    summary: string;
    errors?: string[];
    requireAuth?: boolean;
}): MethodDecorator {
    const formattedDescription = errors?.length
        ? `${description}\n\nThis service can return the following error messages:\n${
              errors.map((error) => `- ${error}`).join('\n') ?? ''
          }`
        : description;
    const decorators = [
        ApiOperation({
            description: formattedDescription,
            summary,
        }),
        ApiResponse(response),
    ];
    if (requireAuth) {
        decorators.push(ApiBearerAuth());
    }
    return applyDecorators(...decorators);
}
