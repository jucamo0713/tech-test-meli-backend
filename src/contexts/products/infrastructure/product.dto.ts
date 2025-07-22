import { AsksDto } from '@products/infrastructure/asks.dto';
import { ReviewDto } from '@products/infrastructure/review.dto';

export interface ProductDto {
    asks: AsksDto[];
    category: string;
    characteristics: Record<string, string | Record<string, string>>;
    description: string;
    discount: number;
    hasCardDiscount: boolean;
    id: string;
    imagesPath: string[];
    information: string[];
    maxInterestFreeInstallments: number;
    mostShipped: boolean;
    name: string;
    navigation: string[];
    price: number;
    ranking: number;
    rating: number;
    reviews: ReviewDto[];
    reviewsResume: string;
    selectableCharacteristics: string[];
    sellUnits: number;
    shippingPrice: number;
    shopId: string;
    shortDescription: string;
    status: string;
    stock: number;
    totalRates: number;
    cardDiscount?: string;
    cardValueDiscount?: number;
    selectableCharacteristicLabel?: string;
}
