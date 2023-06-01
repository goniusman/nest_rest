import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import URLSlug from 'mongoose-slug-generator'

import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/products/entities/product.entity';
import { Type } from 'src/types/entities/type.entity';

@Schema({timestamps: true})
export class Tag extends CoreEntity {

  @Prop({type: String, required: true})
  name: string;

  @Prop({type: String, required: false, slug: "name", unique: true})
  slug: string;

  @Prop({type: Number, required: false})
  parent: number;

  @Prop({type: String, required: false})
  details: string;

  @Prop({type: Attachment, required: false})
  image: Attachment;

  @Prop({type: Type, required: false})
  type?: Type;

  @Prop({type: String, required: false})
  icon: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: false})
  type_id: Type;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}], required: false, default:[]})
  products: Product[] = [];

  @Prop({type: String, required: false})
  language: string;

  @Prop({type: [String], required: false, default:[]})
  translated_languages: string[] = ['en'];

}

const TagSchema = SchemaFactory.createForClass(Tag)

TagSchema.pre("save", function(next) {
  this.slug = this.name.split(" ").join("-")
  next()
})

// TagSchema.plugin(URLSlug("title", {field: "Slug"}))

export {TagSchema} 