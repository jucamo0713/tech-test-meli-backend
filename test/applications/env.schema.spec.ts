import { EnvSchema } from '../../src/applications/env.schema';

describe('EnvSchema', () => {
    const validEnv = {
        APP_GLOBAL_PREFIX: 'api',
        DEFAULT_TIMEOUT_MS: 5000,
        PORT: 3000,
        RATE_LIMITER_COUNT: 100,
        RATE_LIMITER_TTL: 60,
        SWAGGER_DESCRIPTION: 'API Docs',
        SWAGGER_PATH: '/docs',
        SWAGGER_TITLE: 'My API',
    };

    it('should validate a valid environment object', () => {
        const result = EnvSchema.validate(validEnv);
        expect(result.error).toBeUndefined();
        expect(result.value).toEqual(validEnv);
    });

    it('should fail when required fields are missing', () => {
        const { error } = EnvSchema.validate({});
        expect(error).toBeDefined();
        expect(error!.details.length).toBeGreaterThan(0);
    });

    it('should fail when fields are of the wrong type', () => {
        const invalidEnv = {
            ...validEnv,
            PORT: 'not-a-port', // Invalid type
        };

        const { error } = EnvSchema.validate(invalidEnv);
        expect(error).toBeDefined();
        expect(error!.message).toContain('"PORT" must be a number');
    });

    it('should fail if numbers are negative where positive is required', () => {
        const invalidEnv = {
            ...validEnv,
            RATE_LIMITER_COUNT: -5,
        };

        const { error } = EnvSchema.validate(invalidEnv);
        expect(error).toBeDefined();
        expect(error!.message).toContain('"RATE_LIMITER_COUNT" must be a positive number');
    });
});
