import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';

export class CreateProductDto extends PartialType(Product) {
  
  // @ApiProperty()
  // name: string;
  // categories: Category[];
  // tags: Tag[];
}



// , [
//   'id',
//   'slug',
//   'created_at',
//   'updated_at',
//   'orders',
//   'pivot',
//   'shop_id',
//   'categories',
//   'tags',
//   'type_id',
//   'author_id',
//   'related_products',
//   'variation_options',
//   'translated_languages',
// ]