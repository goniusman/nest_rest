import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';

export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}


export class UserAddress extends mongoose.Document{
  street_address: string;
  country: string;
  city: string;
  state: string;
  zip: string;
}


@Schema({ timestamps: true })
export class Address extends CoreEntity {

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: false, type: Boolean, default: false })
  default: boolean;

  @Prop({ required: false, type: UserAddress, default: {} })
  address: UserAddress;

  @Prop({ required: false, type: [String] , enum: AddressType })
  type: AddressType;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: false})
  customer: User;

}


const AddressSchema = SchemaFactory.createForClass(Address)

export {AddressSchema}
