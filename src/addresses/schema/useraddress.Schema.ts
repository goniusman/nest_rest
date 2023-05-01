import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Transform, Type } from 'class-transformer';

import { User } from '../../users/schema/user.schema';
import { Address } from './address.schema';
import {IsOptional} from 'class-validator';

export type UserAddressDocument = UserAddress & Document;

@Schema({timestamps:true})

export class UserAddress {
  @Prop({ required: true })
  street_address: string;

  @Prop({ required: false })
  country: string;

  @Prop({ required: false })
  @IsOptional()
  city: string;
  

  @Prop({ required: false })
  state: string;
  
  @Prop({ required: false })
  zip: string;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
   
   
  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  address_id: Address;

}

const UserAddressSchema = SchemaFactory.createForClass(UserAddress)

export {UserAddressSchema}
 

   
