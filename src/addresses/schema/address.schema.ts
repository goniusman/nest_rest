import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Transform, Type } from 'class-transformer';

import { User } from '../../users/schema/user.schema';
import { UserAddress } from '../../addresses/schema/useraddress.Schema';
import {IsOptional} from 'class-validator';

export type AddressDocument = Address & Document;

@Schema({timestamps:true})
export class Address {

  @Prop({ type: String })
  title: string;

  @Prop({ type: Boolean })
  default: boolean;
  
  @Prop({ required: true })
  type?: AddressType;
  
  @Prop({type: [{  type: mongoose.Schema.Types.ObjectId, ref: 'UserAddress' }]})
  address?: UserAddress[];
  
  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User' })
   user: User;

}

const AddressSchema = SchemaFactory.createForClass(Address)

export {AddressSchema}
 
export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}



