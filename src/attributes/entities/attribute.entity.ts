import { CoreEntity } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { AttributeValue } from './attribute-value.entity';
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';


export type AttributeDocument = Attribute & Document;

@Schema({ timestamps: true })
export class Attribute extends CoreEntity {

  @Prop({ required: false, unique: true })   
  name: string;

  @Prop({ required: false, unique: true })   
  slug: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: false })   
  shop: Shop;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })   
  user: User;

  @Prop({ required: false, type: mongoose.Schema.Types.Array, default: [] })   
  values: AttributeValue[];

  @Prop({ required: false, default: ["en"] })    
  language: string;

  @Prop({ required: false, default: ["en"] })    
  translated_languages: string[];

}

const AttributeSchema = SchemaFactory.createForClass(Attribute);

// UserSchema.virtual('id').get(function (this: UserSchema) {
//   return this._id;
// });


AttributeSchema.pre("save", function(next) {
  this.slug = this.name.split(" ").join("-")
  next()
})


export { AttributeSchema };



// export class Attribute extends CoreEntity {
//   name: string;
//   shop_id: string;
//   shop: Shop;
//   slug: string;
//   values: AttributeValue[];
//   language: string;
//   translated_languages: string[];
// }
