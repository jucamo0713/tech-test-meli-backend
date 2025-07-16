import { ApiProperty } from '@nestjs/swagger';
import { HttpDefaultResponse } from '@shared/infrastructure/entry-points/http/responses/http-default.response';
import { SharedSwaggerConstants } from '@shared/infrastructure/entry-points/http/constants/shared-swagger.constants';
import { HttpPaginationMetadataResponse } from '@shared/infrastructure/entry-points/http/responses/http-pagination-metadata.response';
import { Pagination } from '@shared/domain/model/pagination';
import { Type } from '@nestjs/common';

type intersectionResponseAndPagination<T> = Type<Pagination<T> & HttpDefaultResponse>;
export type HttpPaginationResponseType<T extends intersectionResponseAndPagination<unknown>> = InstanceType<T>;

/**
 * Factory function to create a paginated HTTP response class.
 * @param dataType - The type of data contained in the pagination response.
 * @returns A class that extends HttpDefaultResponse and implements Pagination<T>.
 */
export function HttpPaginationResponse<T>(dataType: Type<T>): Type<Pagination<T> & HttpDefaultResponse> {
    /**
     * Represents a paginated HTTP response.
     */
    class PaginatedResponse extends HttpDefaultResponse implements Pagination<T> {
        /**
         * Creates an instance of PaginatedResponse.
         */
        constructor() {
            super();
            this.data = [];
            this.metadata = new HttpPaginationMetadataResponse();
        }

        @ApiProperty({
            description: SharedSwaggerConstants.PAGINATION_METADATA_DESCRIPTION,
            type: HttpPaginationMetadataResponse,
        })
        metadata: HttpPaginationMetadataResponse;

        @ApiProperty({
            description: SharedSwaggerConstants.PAGINATION_DATA_DESCRIPTION,
            isArray: true,
            type: dataType,
        })
        data: T[];
    }

    return PaginatedResponse;
}
