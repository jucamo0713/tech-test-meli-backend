import { ApiProperty } from '@nestjs/swagger';

/**
 * HttpDefaultResponse represents a standardized response structure for HTTP requests.
 *
 * This class is used to indicate a successful operation by including a `success` property
 * that is always set to `true`. It can be extended or used as is in controllers to provide
 * consistent API responses.
 *
 */
export class HttpDefaultResponse {
    @ApiProperty({
        description: 'Indicates whether the operation was successful.',
        type: Boolean,
    })
    public readonly success: true = true as const;
}
