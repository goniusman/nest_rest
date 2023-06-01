import { Address } from 'src/addresses/entities/address.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { Profile } from 'src/users/entities/profile.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Exclude, Transform } from 'class-transformer';
 
export type UserDocument = User & Document;

enum Permission {
  SUPER_ADMIN = 'super_admin',
  STORE_OWNER = 'store_owner',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}


@Schema({ timestamps: true })
export class User extends CoreEntity {

  // @Transform(({ value }) => value.toString())
  // _id: string;


  @Prop({ required: true, type: String })
  name?: string; 

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String }) 
  @Exclude()
  password: string;

  @Prop({ required: false, type: String })
  email_verified_at: string; 

  @Prop({ required: true, type: [String], enum: Permission, default: [] }) 
  permissions: Permission[] = [];

  @Prop({ required: false, type: Profile, default: {}})
  profile?: Profile;
  
  @Prop({ required: false, type: String })
  shop_id?: string;
  
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }], required: false, default: [] })
  shops?: Shop[];

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Shop' , required: false})
  managed_shop?: Shop;

  @Prop({ required: false, type: Boolean })
  is_active?: boolean = true;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }], default: [] })
  address?: Address[] = [];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], default:[] })
  orders?: Order[] = [];

}


const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.virtual('id').get(function (this: UserSchema) {
//   return this._id;
// });

// UserSchema.pre('save', function (next: any)  {
//   if (!this.isModified('password')) return next();
//   this.password = encrypt(this.password, 10);
//   next();
// });

export {UserSchema}


