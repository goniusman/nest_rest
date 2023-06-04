import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PickType, ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

import { Address, AddressType, UserAddress } from '../entities/address.entity';
import { User } from '../../users/entities/user.entity';

// export class CreateAddressDto extends IntersectionType(Address,UserAddress) {
export class CreateAddressDto extends PickType(Address, ['title', 'type']) {
  title: string 
  default: boolean
  type: AddressType 
  address?: UserAddress[];
  customer: User;
}


