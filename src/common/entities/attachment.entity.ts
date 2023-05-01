// import { CoreEntity } from 'src/common/entities/core.entity';

import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Transform, Type } from 'class-transformer';
import { Category } from 'src/categories/entities/category.entity';


export type AttachmentDocument = Attachment & Document;
@Schema({timestamps:true})
export class Attachment {

  @Prop({type: String, defaultValue:null, required: false})
  thumbnail?: string; 
  
  @Prop({type: String, defaultValue:null, required: false})
  image_dir?: string;

  @Prop({type: String, defaultValue:null, required: false})
  original?: string;

  @IsNotEmpty()
  @Prop({ required: true, type: String })
  item_id:  mongoose.Types.ObjectId;

}

 
const AttachmentSchema = SchemaFactory.createForClass(Attachment)

export {AttachmentSchema}