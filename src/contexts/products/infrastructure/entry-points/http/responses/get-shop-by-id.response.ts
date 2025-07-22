import { HttpDefaultResponse } from '@shared/infrastructure/entry-points/http/responses/http-default.response';
import { SwaggerShop } from '@products/infrastructure/entry-points/http/models';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response class for getting a shop by its ID.
 */
export class GetShopByIdResponse extends HttpDefaultResponse {
    @ApiProperty({ type: SwaggerShop })
    data!: SwaggerShop;
}
