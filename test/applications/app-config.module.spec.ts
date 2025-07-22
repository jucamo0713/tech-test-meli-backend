import { Test } from '@nestjs/testing';
import { AppConfigModule } from '../../src/applications/app-config.module';

describe('AppConfigModule', () => {
    it('should compile the module with mocked ConfigModule', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppConfigModule],
        }).compile();

        expect(moduleRef).toBeDefined();
    });
});
