import * as mongoose from 'mongoose';
import { ApiConsumes, PickType } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
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
import {Type} from 'class-transformer';
// import {Profile} from '../entities/profile.entity';
// import {Profile} from '../schema/profile.schema'




@Schema({_id: false})
export class Avartar extends mongoose.Document{
  @Prop({type: String, required: false})
  thumbnail?: string;
  @Prop({type: String, required: false}) 
  original?: string;
}


@Schema({_id: false})
export class Profile extends mongoose.Document{
  @Prop({type: String, required: false})
  bio?: string;
  @Prop({type: String, required: false}) 
  contact?: string;
  @Prop({type: Avartar, required: false}) 
  avatar?: Avartar;
}


@Schema()
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

  // @Prop(raw({
  //   bio: {type: String},
  //   contact: {type: String},
  //   avatar: {
  //     thumbnail: {type: String},
  //     origin: {type: String}

  //   }
  // }), )

  // @Prop({type: mongoose.Types.ObjectId,ref: 'Profile'})
  // @Prop(() => Profile)
  @Prop({type: Profile, default: {}})
  profile: Profile
  


  // @Prop({ required: true }) 
  // @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required:false })
  // profile?: CreateProfileDto; 

  // // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }] })
  // address: Address[] = [];
  
}

const UserSchema = SchemaFactory.createForClass(User)

export {UserSchema}


// UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
//   return bcrypt.compareAsync(password, this.password);
// };


// interface Profile {
//   bio?: string,
//   contact?: string,
//   avatar?: any
// }