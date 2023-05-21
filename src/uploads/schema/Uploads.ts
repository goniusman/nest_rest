import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type UploadsDocument = Uploads &  Document;


@Schema({ timestamps: true })
 export class Uploads {

  @Prop({type: String, required: false})
  original_filename?: string; 

  @Prop({type: String, required: false})
  public_id?: string;

  @Prop({type: String, required: false})
  resource_type?: string;

  @Prop({type: String, required: false})
  secure_url?: string;
  
  @Prop({type: String, required: false})
  signature?: string;

  @Prop({type: String, required: false})
  version_id?: string;

  @Prop({type: String, required: false})
  url?: string;

 }

const UploadsSchema = SchemaFactory.createForClass(Uploads);

// UserSchema.virtual('id').get(function (this: UserSchema) {
//   return this._id;
// });
// UserSchema.pre('save', function (next: any)  {
//   if (!this.isModified('password')) return next();
//   this.password = encrypt(this.password, 10);
//   next();
// });
export {UploadsSchema}


