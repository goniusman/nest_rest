import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorsModule } from 'src/authors/authors.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ManufacturersModule } from 'src/manufacturers/manufacturers.module';
import { ShopsModule } from 'src/shops/shops.module';
import { ProductSchema } from './entities/product.entity';
import {
  PopularProductsController,
  ProductsController,
} from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    AuthorsModule,
    ManufacturersModule,
    ShopsModule,
    CategoriesModule,
    // AuthorsService,
    // ManufacturersService
  ],
  controllers: [ProductsController, PopularProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
