import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ProductsController,
  PopularProductsController,
} from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entities/product.entity';
import { AuthorsModule } from 'src/authors/authors.module';
import { ManufacturersModule } from 'src/manufacturers/manufacturers.module';

@Module({
  imports: [
  
    MongooseModule.forFeature([
      {name: 'Product', schema: ProductSchema}
    ]),
    AuthorsModule,
    ManufacturersModule
    // AuthorsService,
    // ManufacturersService
  ],
  controllers: [ProductsController, PopularProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
