import { HttpDefaultResponse } from '@shared/infrastructure/entry-points/http/responses/http-default.response';
import { SwaggerProduct } from '@products/infrastructure/entry-points/http/models';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response class for getting a product by its ID.
 */
export class GetProductByIdResponse extends HttpDefaultResponse {
    @ApiProperty({ type: SwaggerProduct })
    data!: SwaggerProduct;
}
