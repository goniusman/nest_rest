import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Transform, Type } from 'class-transformer';
export type ProfileDocument = Profile &  Document;

import { User } from '../../users/schema/user.schema'
// import { Social } from './social.schema'
// import {Attachment} from '../../common/schemas/attachment.schema'

@Schema({ timestamps: true })
export class Profile {
  
  @Prop({ required: false, type: String })
  bio: string = null;

  @Prop({ required: false, type: String })
  contact?: string;

  // // @Prop({ required: false })
  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }] })
  // avatar?: Attachment;

  @Prop({ type: Object, required: false, default: false})
  socials: SocialDto[];

  // @Prop(raw({
  //   link: { type: String },
  //   type: { type: String }
  // }))
  // socials: Social<string, any>;


  // @Prop({ 
  //   type: mongoose.Schema.Types.ObjectId,
  //    ref: 'User',
  //   required: true
  //  })

   @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User' })
   customer_id: User;
  
}

const ProfileSchema = SchemaFactory.createForClass(Profile);


export {ProfileSchema}


interface SocialDto{
  type: string;
  link: string;
}
