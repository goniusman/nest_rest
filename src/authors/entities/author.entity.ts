import { CoreEntity } from '../../common/entities/core.entity';
import { Attachment } from '../../common/entities/attachment.entity';
import { ShopSocials } from '../../settings/entities/setting.entity';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

@Schema({timestamps: true})
export class Author extends CoreEntity {

  @Prop({type: String, required: false,})
  bio?: string;

  @Prop({type: String, required: true,})
  born?: string;

  @Prop({type: Attachment, required: false,})
  cover_image?: Attachment;

  @Prop({type: String, required: false,})
  death?: string;

  @Prop({type: Attachment, required: false,})
  image?: Attachment;

  @Prop({type: Boolean, required: false,})
  is_approved?: boolean;

  @Prop({type: String, required: false,})
  languages?: string;

  @Prop({type: String, required: true,})
  name: string;

  @Prop({type: Number, required: false,})
  products_count?: number;

  @Prop({type: String, required: false,})
  quote?: string;

  @Prop({type: String, required: false, slug: 'name'})
  slug?: string;

  @Prop({type: ShopSocials, required: false,})
  socials?: ShopSocials;

  @Prop({type: String, required: false,})
  language?: string;

  @Prop({type: [String], required: false,})
  translated_languages?: string[] = ["en"];
}

const AuthorSchema = SchemaFactory.createForClass(Author)

AuthorSchema.pre("save", function(next) {
  this.slug = this.name.split(" ").join("-")
  next()
})


export { AuthorSchema }
