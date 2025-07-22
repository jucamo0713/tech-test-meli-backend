import { Module } from '@nestjs/common';
import { ProductsEntryPoint } from '@products/infrastructure/entry-points/http/products.entry-point';
import { ProductsUseCase } from '@products/domain/usecase/products.use-case';
import { ReadJsonRepository } from '@products/infrastructure/driven-adapters/json/read-json.repository';

/**
 * Module for managing products in the application.
 */
@Module({
    controllers: [ProductsEntryPoint],
    providers: [ProductsUseCase, ReadJsonRepository],
})
export class ProductsModule {}
