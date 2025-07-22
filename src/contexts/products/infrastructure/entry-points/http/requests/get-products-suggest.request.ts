import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidationExceptionsMessagesConstants } from '@shared/domain/model/exceptions/validation-exceptions-messages.constants';

/**
 * Request DTO for retrieving a product suggestion based on a product base ID.
 */
export class GetProductsSuggestRequest {
    @ApiProperty({ description: 'The unique identifier of the product base to recommendation.' })
    @IsString({ message: ValidationExceptionsMessagesConstants.ID_MUST_BE_STRING })
    @IsNotEmpty({ message: ValidationExceptionsMessagesConstants.ID_MUST_NOT_BE_EMPTY })
    id!: string;
}
