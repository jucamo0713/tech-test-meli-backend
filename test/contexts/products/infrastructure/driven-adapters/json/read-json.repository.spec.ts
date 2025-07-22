import { ReadJsonRepository } from '@products/infrastructure/driven-adapters/json/read-json.repository';

jest.mock('@products/infrastructure/driven-adapters/json/products.json', () => [
    { id: 'p1', name: 'Product 1', shopId: 's1' },
    { id: 'p2', name: 'Product 2', shopId: 's1' },
    { id: 'p3', name: 'Product 3', shopId: 's2' },
]);

jest.mock('@products/infrastructure/driven-adapters/json/shops.json', () => [
    { id: 's1', name: 'Shop 1' },
    { id: 's2', name: 'Shop 2' },
]);

describe('ReadJsonRepository', () => {
    let repository: ReadJsonRepository;

    beforeEach(() => {
        repository = new ReadJsonRepository();
    });

    describe('getProductById', () => {
        it('should return the product if found', async () => {
            const result = await repository.getProductById('p1');
            expect(result).toEqual(expect.objectContaining({ id: 'p1', name: 'Product 1' }));
        });

        it('should return undefined if product is not found', async () => {
            const result = await repository.getProductById('nonexistent');
            expect(result).toBeUndefined();
        });
    });

    describe('getProductsByShop', () => {
        it('should return products for the given shopId', async () => {
            const result = await repository.getProductsByShop('s1');
            expect(result).toHaveLength(2);
            expect(result.every((p) => p.shopId === 's1')).toBe(true);
        });

        it('should return empty array if no products found', async () => {
            const result = await repository.getProductsByShop('unknown');
            expect(result).toEqual([]);
        });
    });

    describe('getShopById', () => {
        it('should return the shop if found', async () => {
            const result = await repository.getShopById('s1');
            expect(result).toEqual(expect.objectContaining({ id: 's1', name: 'Shop 1' }));
        });

        it('should return undefined if shop not found', async () => {
            const result = await repository.getShopById('invalid');
            expect(result).toBeUndefined();
        });
    });

    describe('getProductsRecommendation', () => {
        it('should return 10 or fewer random products excluding the given id', async () => {
            const result = await repository.getProductsRecommendation('p1');
            expect(result.every((p) => p.id !== 'p1')).toBe(true);
            expect(result.length).toBeLessThanOrEqual(10);
        });
    });
});
