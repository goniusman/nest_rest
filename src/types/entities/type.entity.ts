import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';



export class Banner extends mongoose.Document{
  id: number;
  title?: string;
  description?: string;
  image?: Attachment;
}

export class TypeSettings extends mongoose.Document {
  isHome: boolean;
  layoutType: string;
  productCard: string;
}


@Schema({timestamps: true})
export class Type extends CoreEntity {

  @Prop({type: String, required: true})
  name: string;

  @Prop({type: String, required: false})
  slug: string;

  @Prop({type: Attachment, required: false})
  image: Attachment;

  @Prop({type: String, required: false})
  icon: string;

  @Prop({type: Banner, required: false, default: []})
  banners?: Banner[] = [];

  @Prop({type: Attachment, required: false, default: []})
  promotional_sliders?: Attachment[] = [];

  @Prop({type: TypeSettings, required: false})
  settings?: TypeSettings;

  @Prop({type: String, required: false})
  language: string;

  @Prop({type: [String], required: false})
  translated_languages: string[];
}


const TypeSchema = SchemaFactory.createForClass(Type)

TypeSchema.pre("save", function(next) {
  this.slug = this.name.split(" ").join("-")
  next()
})

export {TypeSchema}

