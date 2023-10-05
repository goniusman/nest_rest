import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { User } from 'src/users/entities/user.entity';

export class LatestMessage extends CoreEntity {
  body: string;
  conversation_id: string;
  user_id: string;
} 

export class Conversation extends CoreEntity {

  // shop_id: number;
  // user_id: string;
  @Prop({type: 'boolean', default: false})
  unseen: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })   
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: false })   
  shop: Shop;


  latest_message: LatestMessage;

}
