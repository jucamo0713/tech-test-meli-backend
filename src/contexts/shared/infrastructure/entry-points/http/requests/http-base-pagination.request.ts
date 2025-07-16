import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { SharedSwaggerConstants } from '@shared/infrastructure/entry-points/http/constants/shared-swagger.constants';
import { Type } from 'class-transformer';
import { ValidationExceptionsMessagesConstants } from '@shared/domain/model/exceptions/validation-exceptions-messages.constants';

/**
 * Base class for HTTP pagination requests.
 */
export class HttpBasePaginationRequest {
    @ApiProperty({
        description: SharedSwaggerConstants.PAGE_PARAM_DESCRIPTION,
    })
    @IsPositive({
        message: ValidationExceptionsMessagesConstants.PAGE_PARAM_MUST_BE_POSITIVE,
    })
    @IsInt({
        message: ValidationExceptionsMessagesConstants.PAGE_PARAM_MUST_BE_INTEGER,
    })
    @IsNumber(
        {
            allowInfinity: false,
            allowNaN: false,
        },
        {
            message: ValidationExceptionsMessagesConstants.PAGE_PARAM_MUST_BE_NUMBER,
        },
    )
    @IsNotEmpty({
        message: ValidationExceptionsMessagesConstants.PAGE_PARAM_MUST_NOT_BE_EMPTY,
    })
    @Type(() => Number)
    page!: number;

    @ApiProperty({
        description: SharedSwaggerConstants.LIMIT_PARAM_DESCRIPTION,
    })
    @IsPositive({
        message: ValidationExceptionsMessagesConstants.LIMIT_PARAM_MUST_BE_POSITIVE,
    })
    @IsInt({
        message: ValidationExceptionsMessagesConstants.LIMIT_PARAM_MUST_BE_INTEGER,
    })
    @IsNumber(
        {
            allowInfinity: false,
            allowNaN: false,
        },
        {
            message: ValidationExceptionsMessagesConstants.LIMIT_PARAM_MUST_BE_NUMBER,
        },
    )
    @IsNotEmpty({
        message: ValidationExceptionsMessagesConstants.LIMIT_PARAM_MUST_NOT_BE_EMPTY,
    })
    @Type(() => Number)
    limit!: number;
}
