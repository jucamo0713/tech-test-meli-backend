import { ProductsReadRepository } from '@products/domain/model/gateways/products-read.repository';
import { ProductDto } from '@products/infrastructure/product.dto';
import { Inject, NotFoundException } from '@nestjs/common';
import { ShopDto } from '@products/infrastructure/shop.dto';
import { ReadJsonRepository } from '@products/infrastructure/driven-adapters/json/read-json.repository';

/**
 * Use case class for managing product-related operations.
 */
export class ProductsUseCase {
    /**
     * Constructor for the ProductsUseCase class.
     * @param productsRepository - An instance of ProductsReadRepository that provides methods to interact with product data.
     * This repository is injected using the `@Inject` decorator from NestJS.
     */
    constructor(@Inject(ReadJsonRepository) private readonly productsRepository: ProductsReadRepository) {}

    /**
     * Retrieves a Product By its id.
     * @param id - The ID of the product to retrieve.
     * @returns A promise that resolves to a ProductDto object representing the product with the specified ID.
     * @throws NotFoundException - If the product with the specified ID does not exist.
     */
    async getProductById(id: string): Promise<ProductDto> {
        const data = await this.productsRepository.getProductById(id);
        if (!data) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return data;
    }

    /**
     * Retrieves a list of products based on the provided category.
     * @param id - The ID of the category for which to retrieve products.
     * @returns A promise that resolves to an array of ProductDto objects representing the products in the specified category.
     */
    async getProductsRecommendation(id: string): Promise<ProductDto[]> {
        return this.productsRepository.getProductsRecommendation(id);
    }

    /**
     * Retrieves a list of products associated with a specific shop ID.
     * @param shopId - The ID of the shop for which to retrieve products.
     * @returns A promise that resolves to an array of ProductDto objects representing the products in the shop.
     */
    async getProductsByShopId(shopId: string): Promise<ProductDto[]> {
        return this.productsRepository.getProductsByShop(shopId);
    }

    /**
     * Retrieves a shop by its ID.
     * @param id - The ID of the shop to retrieve.
     * @returns A promise that resolves to the ShopDto object if found, or throws a NotFoundException if not found.
     * @throws NotFoundException - If the shop with the specified ID does not exist.
     */
    async getShopById(id: string): Promise<ShopDto> {
        const data = await this.productsRepository.getShopById(id);
        if (!data) {
            throw new NotFoundException(`Shop with id ${id} not found`);
        }
        return data;
    }
}
