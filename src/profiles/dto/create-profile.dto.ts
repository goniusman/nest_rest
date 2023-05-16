
// export class CreateProfileDto extends PickType(Profile, [
//   'avatar',
//   'bio',
//   'socials',
//   'contact',
// ]) {
//   customer: ConnectBelongsTo;
// }

// export class ConnectBelongsTo {
//   connect: number;
// }

import * as mongoose from 'mongoose';
import { PickType } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';

import { Address } from '../../addresses/schema/address.schema';
import {Profile} from '../schema/profile.schema'

import { User } from '../../users/schema/user.schema'
// import { Social } from '../schema/social.schema'
import {Attachment} from '../../common/entities/attachment.entity'


// interface SocialDto{
//   type: string;
//   link: string;
// }


export class SocialDto extends mongoose.Document {
  @Prop({ default: " " })
  type: string;

  @Prop({ default: " " })
  link: string;
}


export class CreateProfileDto extends PickType(Profile, [
  // 'avatar',
  'bio',
  // 'socials',
  'contact',
]) {

  @ApiProperty()
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User',required: true  })
  user_id: User;

  @ApiProperty()
  @Prop({ required: false, type: String })
  @IsNotEmpty()
  bio: string = "";
  
  @ApiProperty()
  @Prop({ required: false, type: String  }) 
  @IsNotEmpty()
  contact: string = "";

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }] })
  // avatar?: Attachment;
  
  @ApiProperty()
  @Prop({ type: SocialDto, required: false, default: [] })
  socials: SocialDto[]; 


  
}






export class ConnectBelongsTo {
  connect: number;
}
