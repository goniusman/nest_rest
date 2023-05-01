import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PickType, ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

import { Address } from '../schema/address.schema';
import { User } from '../../users/schema/user.schema';
import { UserAddress } from '../../addresses/schema/useraddress.Schema';

export class CreateAddressDto extends PickType(Address, ['title', 'type']) {
// export class CreateAddressDto extends IntersectionType(Address,UserAddress) {

  @IsNotEmpty()
  @Prop({ required: true })
  title: string = 'address';

  @IsNotEmpty()
  @Prop({ required: true })
  default: boolean = false;

  @IsNotEmpty()
  @Prop({ required: true })
  type: AddressType = AddressType.BILLING;
  
  // @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'UserAddress' })
  // address?: UserAddress[];

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  customer_id: User;

}

export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}
   
