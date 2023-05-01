import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Transform, Type } from 'class-transformer';
export type ProfileDocument = Profile &  Document;

import { User } from './user.schema'
import { Social } from './social.schema'
// import {Attachment} from '../../common/schemas/attachment.schema'

@Schema({ timestamps: true })
export class Profile {
  
  @Prop({ required: false })
  bio: string = null;

  @Prop({ required: false })
  contact?: string;

  // @Prop({ required: false })
  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }] })
  // avatar?: Attachment;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Social' }] })
  // socials?: Social[];

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  // customer?: User;
  
}

const ProfileSchema = SchemaFactory.createForClass(Profile);

export {ProfileSchema}
