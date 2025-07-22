import { ProductsUseCase } from '@products/domain/usecase/products.use-case';
import { ProductsEntryPoint } from '@products/infrastructure/entry-points/http/products.entry-point';
import { GetProductByIdRequest } from '@products/infrastructure/entry-points/http/requests/get-product-by-id.request';
import { GetProductsSuggestRequest } from '@products/infrastructure/entry-points/http/requests/get-products-suggest.request';
import { ProductDto } from '@products/infrastructure/product.dto';
import { GetProductsByShopRequest } from '@products/infrastructure/entry-points/http/requests/get-products-by-shop.request';
import { ShopDto } from '@products/infrastructure/shop.dto';

describe('ProductsEntryPoint', () => {
    let controller: ProductsEntryPoint;
    let useCase: jest.Mocked<ProductsUseCase>;

    beforeEach(() => {
        useCase = {
            getProductById: jest.fn(),
            getProductsByShopId: jest.fn(),
            getProductsRecommendation: jest.fn(),
            getShopById: jest.fn(),
        } as unknown as jest.Mocked<ProductsUseCase>;

        controller = new ProductsEntryPoint(useCase);
    });

    describe('getProductById', () => {
        it('should return product data from use case', async () => {
            const mockProduct = { id: 'p1', name: 'Product 1' } as ProductDto;
            useCase.getProductById.mockResolvedValue(mockProduct);

            const query: GetProductByIdRequest = { id: 'p1' };
            const result = await controller.getProductById(query);

            expect(useCase.getProductById).toHaveBeenCalledWith('p1');
            expect(result.data).toEqual(mockProduct);
        });
    });

    describe('getProductsSuggest', () => {
        it('should return suggested products from use case', async () => {
            const mockProducts = [{ id: 'p2' } as ProductDto, { id: 'p3' } as ProductDto];
            useCase.getProductsRecommendation.mockResolvedValue(mockProducts);

            const query: GetProductsSuggestRequest = { id: 'p1' };
            const result = await controller.getProductsSuggest(query);

            expect(useCase.getProductsRecommendation).toHaveBeenCalledWith('p1');
            expect(result.data).toEqual(mockProducts);
        });
    });

    describe('getProductsByShopId', () => {
        it('should return products for shop from use case', async () => {
            const mockProducts = [{ id: 'p1' } as ProductDto, { id: 'p2' } as ProductDto];
            useCase.getProductsByShopId.mockResolvedValue(mockProducts);

            const query: GetProductsByShopRequest = { id: 's1' };
            const result = await controller.getProductsByShopId(query);

            expect(useCase.getProductsByShopId).toHaveBeenCalledWith('s1');
            expect(result.data).toEqual(mockProducts);
        });
    });

    describe('getShopById', () => {
        it('should return shop data from use case', async () => {
            const mockShop = { id: 's1', name: 'Shop 1' } as ShopDto;
            useCase.getShopById.mockResolvedValue(mockShop);

            const query: GetProductByIdRequest = { id: 's1' };
            const result = await controller.getShopById(query);

            expect(useCase.getShopById).toHaveBeenCalledWith('s1');
            expect(result.data).toEqual(mockShop);
        });
    });
});
