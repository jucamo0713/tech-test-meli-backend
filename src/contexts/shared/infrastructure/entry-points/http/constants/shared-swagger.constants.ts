/**
 * `SharedSwaggerConstants` defines constants used for Swagger API documentation related to shared operations.
 */
export enum SharedSwaggerConstants {
    /**
     * Tag used for categorizing shared-related operations in Swagger API documentation.
     */
    API_TAG = 'Shared Operations',
    /**
     * Description of the health check operation.
     */
    HEALTH_CHECK_DESCRIPTION = 'this service is used to check if the service is up and running',
    /**
     * Summary of the health check operation.
     */
    HEALTH_CHECK_SUMMARY = 'Health Check',
    /**
     * Description of the limit parameter used in pagination.
     */
    LIMIT_PARAM_DESCRIPTION = 'The maximum number of items to return per page',
    /**
     * Description of the page parameter used in pagination.
     */
    PAGE_PARAM_DESCRIPTION = 'The page number to retrieve, starting from 1',
    /**
     * Description of the data for pagination in HTTP responses.
     */
    PAGINATION_DATA_DESCRIPTION = 'Data for pagination in HTTP responses, containing an array of items.',
    /**
     * Description of the pagination metadata used in HTTP responses.
     */
    PAGINATION_METADATA_DESCRIPTION = 'Metadata for pagination in HTTP responses, including current page, total items, and total pages.',
}
