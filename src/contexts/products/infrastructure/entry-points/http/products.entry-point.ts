import { Controller, Get, Query } from '@nestjs/common';
import { ProductsUseCase } from '@products/domain/usecase/products.use-case';
import { ApiTags } from '@nestjs/swagger';
import { ProductsUrlConstants } from '@products/infrastructure/entry-points/http/products-route.constants';
import { SwaggerEndpointDecorator } from '@shared/infrastructure/driven-adapters/swagger/swagger-endpoint.decorator';
import { GetProductByIdResponse } from '@products/infrastructure/entry-points/http/responses/get-product-by-id.response';
import { GetProductByIdRequest } from '@products/infrastructure/entry-points/http/requests/get-product-by-id.request';
import { GetShopByIdResponse } from '@products/infrastructure/entry-points/http/responses/get-shop-by-id.response';
import { GetProductsByShopRequest } from '@products/infrastructure/entry-points/http/requests/get-products-by-shop.request';
import { GetProductByShopResponse } from '@products/infrastructure/entry-points/http/responses/get-product-by-shop.response';
import { GetProductSuggestResponse } from '@products/infrastructure/entry-points/http/responses/get-product-suggest.response';
import { GetProductsSuggestRequest } from '@products/infrastructure/entry-points/http/requests/get-products-suggest.request';

/**
 * ProductsEntryPoint is a controller that handles HTTP requests related to products.
 */
@Controller()
@ApiTags('Products')
export class ProductsEntryPoint {
    /**
     * Creates an instance of ProductsEntryPoint.
     * @param useCase - The use case for handling product-related operations.
     */
    constructor(readonly useCase: ProductsUseCase) {}

    /**
     * Get product by ID.
     * @param query - The request query containing the product ID.
     * @returns A promise that resolves to the product details.
     */
    @Get(ProductsUrlConstants.GET_PRODUCT_BY_ID)
    @SwaggerEndpointDecorator({
        description: 'Get product by ID',
        response: { type: GetProductByIdResponse },
        summary: 'getProductById',
    })
    async getProductById(@Query() query: GetProductByIdRequest): Promise<GetProductByIdResponse> {
        const response = new GetProductByIdResponse();
        response.data = await this.useCase.getProductById(query.id);
        return response;
    }

    /**
     * Get product suggestion based on shop ID.
     * @param query - The request query containing the shop ID.
     * @returns A promise that resolves to the list of suggested products for the specified shop.
     */
    @Get(ProductsUrlConstants.GET_PRODUCTS_RECOMMENDED)
    @SwaggerEndpointDecorator({
        description: 'Get products suggestion by shop ID',
        response: { type: GetProductSuggestResponse },
        summary: 'getProductsSuggest',
    })
    async getProductsSuggest(@Query() query: GetProductsSuggestRequest): Promise<GetProductSuggestResponse> {
        const response = new GetProductSuggestResponse();
        response.data = await this.useCase.getProductsRecommendation(query.id);
        return response;
    }

    /**
     * Get products by shop ID.
     * @param query - The request query containing the shop ID.
     * @returns A promise that resolves to the list of products in the specified shop.
     */
    @Get(ProductsUrlConstants.GET_PRODUCTS_BY_SHOP)
    @SwaggerEndpointDecorator({
        description: 'Get products by shop ID',
        response: { type: GetProductByShopResponse },
        summary: 'getProductsByShopId',
    })
    async getProductsByShopId(@Query() query: GetProductsByShopRequest): Promise<GetProductByShopResponse> {
        const response = new GetProductByShopResponse();
        response.data = await this.useCase.getProductsByShopId(query.id);
        return response;
    }

    /**
     * Get product by ID.
     * @param query - The request query containing the product ID.
     * @returns A promise that resolves to the product details.
     */
    @Get(ProductsUrlConstants.GET_SHOP_BY_ID)
    @SwaggerEndpointDecorator({
        description: 'Get shop by ID',
        response: { type: GetShopByIdResponse },
        summary: 'getShopById',
    })
    async getShopById(@Query() query: GetProductByIdRequest): Promise<GetShopByIdResponse> {
        const response = new GetShopByIdResponse();
        response.data = await this.useCase.getShopById(query.id);
        return response;
    }
}
