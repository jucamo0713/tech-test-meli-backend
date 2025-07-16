import { Provider } from '@nestjs/common';
import { NestCqrsCaller } from '@shared/infrastructure/driven-adapters/nestjs/cqrs/nest-cqrs-caller.service';

/**
 * An array of shared providers used across the application.
 */
const SharedProviders: Provider[] = [NestCqrsCaller];

export default SharedProviders;
