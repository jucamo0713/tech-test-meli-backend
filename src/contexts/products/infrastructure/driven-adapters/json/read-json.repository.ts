import { ProductDto } from '@products/infrastructure/product.dto';
import { Logger } from '@nestjs/common';
import products from './products.json';
import shops from './shops.json';
import { ProductsReadRepository } from '@products/domain/model/gateways/products-read.repository';
import { ShopDto } from '@products/infrastructure/shop.dto';

/**
 * Repository for reading product and shop data from JSON files.
 */
export class ReadJsonRepository implements ProductsReadRepository {
    private readonly logger = new Logger(ReadJsonRepository.name);

    /**
     * Get a product by its ID.
     * @param id - The ID of the product to retrieve.
     * @returns A promise that resolves to the ProductDto if found, or undefined if not found.
     */
    async getProductById(id: string): Promise<ProductDto | undefined> {
        this.logger.debug(`Getting product by ID: ${id}`);
        const found = products.find((item) => item.id === id);
        this.logger.debug(`Product found: ${found ? 'Yes' : 'No'}`);
        return found;
    }

    /**
     * Get all products associated with a specific shop.
     * @param shopId - The ID of the shop for which to retrieve products.
     * @returns A promise that resolves to an array of ProductDto objects associated with the shop.
     */
    async getProductsByShop(shopId: string): Promise<ProductDto[]> {
        this.logger.debug(`Getting products for shop ID: ${shopId}`);
        const found = products.filter((item) => item.shopId === shopId);
        this.logger.debug(`Products found: ${found.length}`);
        return found;
    }

    /**
     * Get a shop by its ID.
     * @param shopId - The ID of the shop to retrieve.
     * @returns A promise that resolves to the ShopDto if found, or undefined if not found.
     */
    async getShopById(shopId: string): Promise<ShopDto | undefined> {
        this.logger.debug(`Getting shop by ID: ${shopId}`);
        const found = shops.find((item) => item.id === shopId);
        this.logger.debug(`Shop found: ${found ? 'Yes' : 'No'}`);
        return found;
    }

    /**
     * Get product recommendations based on a product ID.
     * @param id - The ID of the product to base.
     * @returns A promise that resolves to an array of ProductDto objects recommended for the product.
     */
    async getProductsRecommendation(id: string): Promise<ProductDto[]> {
        this.logger.debug(`Getting product recommendations for ID: ${id}`);
        const found = products
            .filter((item) => item.id !== id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        this.logger.debug(`Recommendations found: ${found.length}`);
        return found;
    }
}
