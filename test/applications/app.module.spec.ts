import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/applications/app.module';

// Mocks vacíos para los módulos que se importan en AppModule
jest.mock('../../src/applications/app-config.module', () => ({
    /**
     * Mock for AppConfigModule
     */
    AppConfigModule: class MockAppConfigModule {},
}));

jest.mock('../../src/shared/applications/shared.module', () => ({
    /**
     * Mock for SharedModule
     */
    SharedModule: class MockSharedModule {},
}));

jest.mock('../../src/products/applications/products.module', () => ({
    /**
     * Mock for ProductsModule
     */
    ProductsModule: class MockProductsModule {},
}));

describe('AppModule', () => {
    it('should compile the module successfully with mocked modules', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        expect(moduleRef).toBeDefined();
    });
});
