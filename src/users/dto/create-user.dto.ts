import * as mongoose from 'mongoose';
import { ApiConsumes, PickType } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { User } from '../entities/user.entity';
import { CreateProfileDto } from './create-profile.dto';


// export class CreateUserDto extends PickType(User, [
//   'name',
//   'email',
//   'password',
// ]) {
//   address?: CreateAddressDto[];
//   profile?: CreateProfileDto[];
//   permission: Permission = Permission.CUSTOMER;
// }
import { Address } from '../../addresses/entities/address.entity';
import {Type} from 'class-transformer';
import { Shop } from 'src/shops/entities/shop.entity';

export enum Permission {
  SUPER_ADMIN = 'super_admin',
  STORE_OWNER = 'store_owner',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export class CreateUserDto extends PickType(User, ['email', 'password']) {
  
  // @IsString()
  // @MaxLength(20)
  name?: string; 

  permissions?: Permission[];

  managed_shop?: Shop;

}
