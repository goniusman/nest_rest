
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

export class CreateProfileDto extends PickType(Profile, [
  // 'avatar',
  'bio',
  // 'socials',
  'contact',
]) {

  @ApiProperty()
  @Prop({ required: true, type: String })
  @IsNotEmpty()
  bio: string = "";
  
  @ApiProperty()
  @Prop({ required: true, type: String  }) 
  @IsNotEmpty()
  contact: string = "";

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }] })
  // avatar?: Attachment;
  
  @ApiProperty()
  @Prop({ type: Object, required: false, default: false })
  socials: SocialDto[]; 

  @ApiProperty()
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User',required: true  })
  customer_id: User;
  
}



interface SocialDto{
  type: string;
  link: string;
}



export class ConnectBelongsTo {
  connect: number;
}
