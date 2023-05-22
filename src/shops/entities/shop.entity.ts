import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserAddress } from 'src/addresses/entities/address.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Location, ShopSocials } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/schema/user.schema'




export class Balance extends mongoose.Document {
  id: number;
  admin_commission_rate: number;
  shop: Shop;
  total_earnings: number;
  withdrawn_amount: number;
  current_balance: number;
  payment_info: PaymentInfo;
}

export class PaymentInfo extends mongoose.Document {
  account: string;
  name: string;
  email: string;
  bank: string;
}

export class ShopSettings extends mongoose.Document {
  socials: ShopSocials[] = [];
  contact: string;
  location: Location;
  website: string;
}


// export class ApproveShopDto  {
//   id: number;
//   admin_commission_rate: number;
// }




@Schema({timestamps:true})
export class Shop extends CoreEntity {

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User', })
  owner_id: User;

  // @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: {}})
  // owner: User;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
  staffs?: User[];

  @Prop({ required: false, type: Boolean })
  is_active: boolean;

  @Prop({ required: false, type: Number })
  orders_count: number;

  @Prop({ required: false, type: Number })
  products_count: number;

  @Prop({ required: false, type: Balance })
  balance?: Balance;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String })
  slug: string;
  
  @Prop({ required: false, type: Number })
  admin_commission_rate?: number = 0;

  @Prop({ required: true, type: String })
  description?: string;

  @Prop({ required: true, type: Attachment })
  cover_image: Attachment;

  @Prop({ required: true, type: Attachment })
  logo?: Attachment;

  @Prop({type: UserAddress, required: true})
  address: UserAddress;

  @Prop({type: ShopSettings, required: true})
  settings?: ShopSettings;

  // @Prop(raw({
  //   id: {type: Number},
  //   admin_commission_rate: {type: String}
  // }))
  // ApproveShop: Record<string , any>;



}



const ShopSchema = SchemaFactory.createForClass(Shop)

export {ShopSchema}
