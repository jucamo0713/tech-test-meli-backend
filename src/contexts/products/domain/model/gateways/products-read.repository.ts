import { ProductDto } from '@products/infrastructure/product.dto';
import { ShopDto } from '@products/infrastructure/shop.dto';

export interface ProductsReadRepository {
    getProductById(id: string): Promise<ProductDto | undefined>;

    getProductsByShop(shopId: string): Promise<ProductDto[]>;

    getProductsRecommendation(id: string): Promise<ProductDto[]>;

    getShopById(shopId: string): Promise<ShopDto | undefined>;
}
