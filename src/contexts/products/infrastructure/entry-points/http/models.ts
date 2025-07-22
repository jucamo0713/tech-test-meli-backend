import { ApiProperty } from '@nestjs/swagger';
import { AsksDto } from '@products/infrastructure/asks.dto';
import { ProductDto } from '@products/infrastructure/product.dto';
import { ReviewDto } from '@products/infrastructure/review.dto';
import { ShopDto } from '@products/infrastructure/shop.dto';

/**
 * Swagger representation of the AskDto interface.
 */
export class SwaggerAsk implements AsksDto {
    @ApiProperty({})
    text!: string;
    @ApiProperty({})
    answer?: string;
}

/**
 * Swagger representation of the ReviewDto interface.
 */
export class SwaggerReview implements ReviewDto {
    @ApiProperty({})
    punctuation!: number;
    @ApiProperty({})
    text!: string;
}

/**
 * Swagger representation of the ShopDto interface.
 */
export class SwaggerShop implements ShopDto {
    @ApiProperty({})
    bannerPath!: string;
    @ApiProperty({})
    followers!: number;
    @ApiProperty({})
    id!: string;
    @ApiProperty({})
    imagePath!: string;
    @ApiProperty({})
    isOfficial!: boolean;
    @ApiProperty({})
    name!: string;
    @ApiProperty({})
    productsCount!: number;
    @ApiProperty({})
    rating!: number;
    @ApiProperty({})
    sellUnits!: number;
}

/**
 * Swagger representation of the ProductDto interface.
 */
export class SwaggerProduct implements ProductDto {
    @ApiProperty({ type: [SwaggerAsk] })
    asks!: SwaggerAsk[];
    @ApiProperty({ required: false, type: String })
    cardDiscount?: string;
    @ApiProperty({ required: false, type: Number })
    cardValueDiscount?: number;
    @ApiProperty({ type: String })
    category!: string;
    @ApiProperty({ type: Object })
    characteristics!: Record<string, string | Record<string, string>>;
    @ApiProperty({ type: String })
    description!: string;
    @ApiProperty({ type: Number })
    discount!: number;
    @ApiProperty({ type: Boolean })
    hasCardDiscount!: boolean;
    @ApiProperty({ type: String })
    id!: string;
    @ApiProperty({ type: [String] })
    imagesPath!: string[];
    @ApiProperty({ type: [String] })
    information!: string[];
    @ApiProperty({ type: Number })
    maxInterestFreeInstallments!: number;
    @ApiProperty({ type: Boolean })
    mostShipped!: boolean;
    @ApiProperty({ type: String })
    name!: string;
    @ApiProperty({ type: [String] })
    navigation!: string[];
    @ApiProperty({ type: Number })
    price!: number;
    @ApiProperty({ type: Number })
    ranking!: number;
    @ApiProperty({ type: Number })
    rating!: number;
    @ApiProperty({ type: [SwaggerReview] })
    reviews!: SwaggerReview[];
    @ApiProperty({ type: String })
    reviewsResume!: string;
    @ApiProperty({ required: false, type: String })
    selectableCharacteristicLabel?: string;
    @ApiProperty({ type: [String] })
    selectableCharacteristics!: string[];
    @ApiProperty({ type: Number })
    sellUnits!: number;
    @ApiProperty({ type: Number })
    shippingPrice!: number;
    @ApiProperty({ type: SwaggerShop })
    shopId!: string;
    @ApiProperty({ type: String })
    shortDescription!: string;
    @ApiProperty({ type: String })
    status!: string;
    @ApiProperty({ type: Number })
    stock!: number;
    @ApiProperty({ type: Number })
    totalRates!: number;
}
