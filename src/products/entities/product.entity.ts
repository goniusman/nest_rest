import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {AttributeValue} from 'src/attributes/entities/attribute-value.entity';
import {Author} from 'src/authors/entities/author.entity';
import {Category} from 'src/categories/entities/category.entity';
import {Attachment} from 'src/common/entities/attachment.entity';
import {CoreEntity} from 'src/common/entities/core.entity';
import {Manufacturer} from 'src/manufacturers/entities/manufacturer.entity';
import {Order} from 'src/orders/entities/order.entity';
import {Shop} from 'src/shops/entities/shop.entity';
import {Tag} from 'src/tags/entities/tag.entity';
import {Type} from 'src/types/entities/type.entity';
import {User} from 'src/users/entities/user.entity';
import {Review} from '../../reviews/entities/review.entity';


export type ProductDocument = Product & Document


enum ProductStatus {
  PUBLISH = 'published',
  DRAFT = 'draft',
}

enum ProductType {
  SIMPLE = 'simple',
  VARIABLE = 'variable',
}

export class OrderProductPivot extends mongoose.Document{
  variation_option_id?: number;
  order_quantity: number;
  unit_price: number;
  subtotal: number;
  product: string
}

export class Variation extends mongoose.Document {
  id: number;
  title: string;
  price: number;
  sku: string;
  is_disable: boolean;
  sale_price?: number;
  quantity: number;
  options: VariationOption[] = [];
}

export class VariationOption extends mongoose.Document {
  name: string;
  value: string;
}



@Schema({timestamps:true})
export class Product extends CoreEntity {
 
  _doc?: any;
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String, unique:true})
  slug: string;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Type' , required: false})
  type_id: Type;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Author' })
  author_id: Author; 
  
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer' })
  manufacturer_id: Manufacturer;

  // @Prop({ required: false, type: String})
  // shop: string; 

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Shop' })
  shop_id: Shop;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop({ required: false, type: String , enum: ProductType })
  product_type: ProductType;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}], default: []})
  categories: Category[];

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}], default: []})
  tags?: Tag[];

  @Prop({type: mongoose.Schema.Types.Array, default: []})
  variations?: AttributeValue[];

  @Prop({ required: false, type: mongoose.Schema.Types.Array, default: [] })
  variation_options?: Variation[];

  // @Prop({ required: false, type: OrderProductPivot, default: {} })
  // pivot?: OrderProductPivot;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}], default: []})
  orders?: Order[];

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}], default: [], required:false})
  related_products?: Product[] = [];

  @Prop({ required: false, type: String })
  description: string;

  @Prop({ required: false, type: Boolean})
  in_stock: boolean;

  @Prop({ required: false, type: Boolean })
  is_taxable: boolean;

  @Prop({ required: false, type: Number })
  sale_price?: number;

  @Prop({ required: false, type: Number })
  max_price?: number;

  @Prop({ required: false, type: Number })
  min_price?: number;

  @Prop({ required: false, type: String })
  sku?: string;

  @Prop({type: mongoose.Schema.Types.Array, default: []})
  gallery?: Attachment[] = [];

  @Prop({  type: Attachment, required: false})
  image?: Attachment;

  @Prop({ required: false, type: String , enum: ProductStatus })
  status: ProductStatus;

  @Prop({ required: false, type: String })
  height?: string;

  @Prop({ required: false, type: String })
  length?: string;

  @Prop({ required: false, type: String })
  width?: string;

  @Prop({ required: false, type: Number })
  price?: number;

  @Prop({ required: false, type: Number })
  quantity: number;

  @Prop({ required: false, type: String })
  unit: string;

  @Prop({ required: false, type: Number })
  ratings: number;

  @Prop({ required: false, type: Boolean })
  in_wishlist: boolean;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}], default: []})
  my_review?: Review[];

  @Prop({ required: false, type: String })
  language?: string;

  @Prop({type: [String], default: ["en"], required: false})
  translated_languages?: string[] = ["en"];

}


const ProductSchema = SchemaFactory.createForClass(Product)


ProductSchema.pre("save", function(next) {
  this.slug = this.name.split(" ").join("-")
  next()
})


export {ProductSchema};

export class File  {

  // @Prop({type: Number, required: false})
  attachment_id: number;

  // @Prop({type: String, required: false})
  url: string;

  // @Prop({type: Number, required: false})
  fileable_id: number;

}
