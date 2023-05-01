import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Transform, Type } from 'class-transformer';
export type SocialDocument = Social &  Document;

import { User } from './user.schema'
// import { Profile } from './profile.schema'

@Schema({ timestamps: true })

export class Social {

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  link: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  user: User;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }] })
  // profile?: Profile;
}

const SocialSchema = SchemaFactory.createForClass(Social);

export { SocialSchema }
