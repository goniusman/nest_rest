import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';

import { User } from '../../users/schema/user.schema';
import { IsOptional } from 'class-validator';

export type AttributeDocument = Attribute & Document;

@Schema({ timestamps: true })
export class Attribute {

  @Prop({ required: false })   

  name: string;
  @Prop({ required: false })   
  shop_id: string;
  // @Prop({ required: false })   
  // shop: Shop;
  @Prop({ required: false })   
  slug: string;
  // @Prop({ required: false })   
  // values: AttributeValue[];
  @Prop({ required: false })    
  language: string;
  // @Prop({ required: false })   
  // translated_languages: string[];

}

const AttributeSchema = SchemaFactory.createForClass(Attribute);

// UserSchema.virtual('id').get(function (this: UserSchema) {
//   return this._id;
// });

export { AttributeSchema };


