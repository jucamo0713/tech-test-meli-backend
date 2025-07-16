import { PaginationMetadata } from '@shared/domain/model/pagination';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents the metadata for pagination in HTTP responses.
 */
export class HttpPaginationMetadataResponse implements PaginationMetadata {
    @ApiProperty({ description: 'The current page number.' })
    page: number = 0;

    @ApiProperty({ description: 'The current limit setter.' })
    limit: number = 0;

    @ApiProperty({ description: 'The total number of pages.' })
    totalPages: number = 0;

    @ApiProperty({ description: 'The total number of items across all pages.' })
    totalItems: number = 0;
}
