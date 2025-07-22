import { NotFoundException } from '@nestjs/common';
import { ProductsReadRepository } from '@products/domain/model/gateways/products-read.repository';
import { ProductsUseCase } from '@products/domain/usecase/products.use-case';
import { ShopDto } from '@products/infrastructure/shop.dto';
import { ProductDto } from '@products/infrastructure/product.dto';

describe('ProductsUseCase', () => {
    let useCase: ProductsUseCase;
    let productsRepository: jest.Mocked<ProductsReadRepository>;

    beforeEach(() => {
        productsRepository = {
            getProductById: jest.fn(),
            getProductsByShop: jest.fn(),
            getProductsRecommendation: jest.fn(),
            getShopById: jest.fn(),
        };

        useCase = new ProductsUseCase(productsRepository);
    });

    describe('getProductById', () => {
        it('should return the product when found', async () => {
            const product: ProductDto = { id: '1', name: 'Test Product' } as ProductDto;
            productsRepository.getProductById.mockResolvedValue(product);

            const result = await useCase.getProductById('1');
            expect(result).toEqual(product);
        });

        it('should throw NotFoundException if product is not found', async () => {
            productsRepository.getProductById.mockResolvedValue(undefined);

            await expect(useCase.getProductById('1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('getProductsRecommendation', () => {
        it('should return a list of products', async () => {
            const products: ProductDto[] = [{ id: '1', name: 'P1' } as ProductDto];
            productsRepository.getProductsRecommendation.mockResolvedValue(products);

            const result = await useCase.getProductsRecommendation('cat1');
            expect(result).toEqual(products);
        });
    });

    describe('getProductsByShopId', () => {
        it('should return products by shop', async () => {
            const products: ProductDto[] = [{ id: '1', name: 'P1' } as ProductDto];
            productsRepository.getProductsByShop.mockResolvedValue(products);

            const result = await useCase.getProductsByShopId('shop1');
            expect(result).toEqual(products);
        });
    });

    describe('getShopById', () => {
        it('should return the shop when found', async () => {
            const shop: ShopDto = { id: 's1', name: 'Shop1' } as ShopDto;
            productsRepository.getShopById.mockResolvedValue(shop);

            const result = await useCase.getShopById('s1');
            expect(result).toEqual(shop);
        });

        it('should throw NotFoundException if shop is not found', async () => {
            productsRepository.getShopById.mockResolvedValue(undefined);

            await expect(useCase.getShopById('s1')).rejects.toThrow(NotFoundException);
        });
    });
});
