import * as mongoose from 'mongoose';
import { ApiConsumes, PickType } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

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

export enum Permission {
  SUPER_ADMIN = 'super_admin',
  STORE_OWNER = 'store_owner',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export class CreateUserDto extends PickType(User, ['email', 'password']) {
  name?: string; 
  permissions: any;
  shop_id?: string;
}
