import { Test } from '@nestjs/testing';
import { ProductsModule } from '@products/applications/products.module';

// Mock de cada dependencia que se registra en el módulo
jest.mock('@products/infrastructure/entry-points/http/products.entry-point', () => ({
    ProductsEntryPoint: jest.fn(),
}));

jest.mock('@products/domain/usecase/products.use-case', () => ({
    ProductsUseCase: jest.fn(),
}));

jest.mock('@products/infrastructure/driven-adapters/json/read-json.repository', () => ({
    ReadJsonRepository: jest.fn(),
}));

describe('ProductsModule', () => {
    it('should compile the module with mocked controller and providers', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ProductsModule],
        }).compile();

        expect(moduleRef).toBeDefined();
    });
});
