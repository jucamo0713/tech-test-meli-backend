import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvSchema } from './env.schema';

/**
 * The `AppConfigModule` is a global module that provides configuration management for the application.
 */
@Global()
@Module({
    exports: [ConfigModule],
    imports: [
        ConfigModule.forRoot({
            expandVariables: true,
            isGlobal: true,
            validationSchema: EnvSchema,
        }),
    ],
})
export class AppConfigModule {}
