import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config.module';
import { SharedModule } from '@shared/applications/shared.module';

/**
 * The main application module that imports the AppConfigModule, SharedModule, and contexts module.
 */
@Module({
    exports: [AppConfigModule],
    imports: [AppConfigModule, SharedModule],
})
export class AppModule {}
