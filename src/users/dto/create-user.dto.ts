import * as mongoose from 'mongoose';
import { ApiConsumes, PickType } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { User } from '../schema/user.schema';
import { CreateProfileDto } from '../../profiles/dto/create-profile.dto';

enum Permission {
  SUPER_ADMIN = 'Super admin',
  STORE_OWNER = 'Store owner',
  STAFF = 'Staff',
  CUSTOMER = 'Customer',
}
// export class CreateUserDto extends PickType(User, [
//   'name',
//   'email',
//   'password',
// ]) {
//   address?: CreateAddressDto[];
//   profile?: CreateProfileDto[];
//   permission: Permission = Permission.CUSTOMER;
// }
import { Address } from '../../addresses/schema/address.schema';
// import {Profile} from '../schema/profile.schema'
export class CreateUserDto extends PickType(User, ['email', 'password']) {

  @Prop({ required: true })
  @ApiProperty()
  @IsNotEmpty()
  name?: string; 

  @ApiProperty()
  @Prop({ required: true })
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Prop({ required: true }) 
  @IsNotEmpty()
  password: string;
  
  @ApiProperty()
  @Prop({ required: false }) 
  @IsNotEmpty()
  permission: Permission = Permission.CUSTOMER;

  @ApiProperty()
  @Prop({ required: false }) 
  @IsNotEmpty()
  is_active?: boolean = false;
  
  @ApiProperty()
  @Prop({ required: false }) 
  @IsNotEmpty()
  shop_id?: number = 0;

  // @Prop({ required: false }) 
  // @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  // profile?: CreateProfileDto; 

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }] })
  address?: CreateAddressDto;
  
  // @ApiProperty()
  @Prop({ required: false }) 
  email_verified_at: number = 0;  

  // @Prop({ required: true, type: Object, default: false})
  // profile: Profile
  


  // @Prop({ required: true }) 
  // @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required:false })
  // profile?: CreateProfileDto; 

  // // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }] })
  // address: Address[] = [];
  
}




interface Profile {
  bio: string,
  contact: string
}