import Joi from 'joi';

export const EnvSchema: Joi.ObjectSchema = Joi.object({
    APP_GLOBAL_PREFIX: Joi.string(),
    DEFAULT_TIMEOUT_MS: Joi.number().positive(),
    PORT: Joi.number().port(),
    RATE_LIMITER_COUNT: Joi.number().integer().positive(),
    RATE_LIMITER_TTL: Joi.number().integer().positive(),
    SWAGGER_DESCRIPTION: Joi.string(),
    SWAGGER_PATH: Joi.string(),
    SWAGGER_TITLE: Joi.string(),
})
    .options({ presence: 'required' })
    .required();
