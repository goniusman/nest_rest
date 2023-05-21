import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Transform, Type } from 'class-transformer';
import { IsEmail } from 'class-validator';

import { Address } from '../../addresses/schema/address.schema';
// import { Profile } from '../entities/profile.entity';
// import {Profile} from '../../profiles/schema/profile.schema'
export type UserDocument = User &  Document;



// interface Profile {
//   bio: string,
//   contact: string
// }


export class Avatar extends mongoose.Document{
  @Prop({type: String, required: false})
  thumbnail?: string;
  @Prop({type: String, required: false}) 
  original?: string;

}



export class Profile extends mongoose.Document{
  
  @Prop({type: String, required: false})
  bio?: string;
  @Prop({type: String, required: false}) 
  contact?: string;
  @Prop({type: Avatar, required: false}) 
  avatar?: Avatar;

}

enum Permission {
  SUPER_ADMIN = 'super_admin',
  STORE_OWNER = 'store_owner',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

@Schema({ timestamps: true })
 export class User {

  @Prop({ required: true, type: String })
  name?: string; 

  @Prop({ required: true, type: String })
  @IsEmail()
  email: string;

  @Prop({ required: true, type: String }) 
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @Prop({ required: true, type: [String], enum: Permission, default: [] }) 
  @IsNotEmpty()
  permissions: Permission[] = [Permission.STORE_OWNER,Permission.SUPER_ADMIN];

  @Prop({ required: false, type: Number })
  email_verified_at?: number;


  @Prop({ required: true, type: Boolean })
  is_active?: boolean = true;


  @Prop({ required: false, type: Number })
  shop_id: number; 
  
  // @Prop({ required: true, type: Object, default: false})
  // profile: Profile

  // @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Shop' })
  // managed_shop?: Shop;
  // @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Profile'  })
  // @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  @Prop({type: Profile})
  profile?: Profile; 


  // @Prop({ 
  //   type: mongoose.Schema.Types.ObjectId,
  //    ref: 'Profile',
  //    required: false 
  //   })
  // profile?: Profile; 

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }] })
  // address: Address[] = [];
  
  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] })
  // orders?: Order[];

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }] })
  // shops?: Shop[];


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


