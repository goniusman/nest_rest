import { CoreEntity } from '../../common/entities/core.entity';
import { Attachment } from '../../common/entities/attachment.entity';
import { ShopSocials } from '../../settings/entities/setting.entity';
import { Type } from '../../types/entities/type.entity';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({timestamps:true})
export class Manufacturer extends CoreEntity {

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

  @Prop({type: Number, required:false})
  products_count?: number;

  @Prop({type: String, required:false, slug: 'name'})
  slug?: string;

  @Prop({type: ShopSocials, required:false, default: {}})
  socials?: ShopSocials;

  @Prop({type: String, required:false})
  type_id: string;

  // @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Type', required:false})
  // type_id?: string;

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