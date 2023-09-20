import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

export class UserAddress extends mongoose.Document {
  street_address: string;
  country: string;
  city: string;
  state: string;
  zip: string;
}

@Schema({ timestamps: true })
export class Address extends mongoose.Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    default: Types.ObjectId,
  })
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: false, type: Boolean, default: false })
  default: boolean;

  @Prop({ required: false, type: UserAddress, default: {} })
  address: UserAddress;

  @Prop({ required: false, type: String, enum: AddressType })
  type: AddressType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  customer: User;
}

// const AddressSchema = SchemaFactory.createForClass(Address)

// export {AddressSchema}
