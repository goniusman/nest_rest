import { CoreEntity } from '../../common/entities/core.entity';
import { Attachment } from '../../common/entities/attachment.entity';
import { ShopSocials } from '../../settings/entities/setting.entity';
import { Type } from '../../types/entities/type.entity';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from 'src/products/entities/product.entity';

@Schema({timestamps:true})
export class Manufacturer extends CoreEntity {
  // [x: string]: any;

  _id(_id: any, manufacturer: Manufacturer) {
    throw new Error('Method not implemented.');
  }

  @Prop({type: Attachment, required:false})
  cover_image?: Attachment;

  @Prop({type: String, required:false})
  description?: string;

  @Prop({type: Attachment, required:false})
  image?: Attachment;

  @Prop({type: Boolean, required:false})
  is_approved?: boolean;

  @Prop({type: String, required:true})
  name: string;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}], required:false, default: []})
  products_count?: string[];

  @Prop({type: String, required:false, slug: 'name'})
  slug?: string;

  @Prop({type: ShopSocials, required:false, default: {}})
  socials?: ShopSocials;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Type', required:false})
  type_id: Type;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required:false})
  shop_id?: string;

  @Prop({type: String, required:false})
  website?: string;

  @Prop({type: String, required:false})
  language?: string;

  @Prop({type: [String], required:false})
  translated_languages?: string[];
}


const ManufacturerSchema = SchemaFactory.createForClass(Manufacturer)

ManufacturerSchema.pre("save", function(next) {
  this.slug = this.name.split(" ").join("-")
  next()
})

export {ManufacturerSchema}