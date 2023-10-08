import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';

export enum WithdrawStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  ON_HOLD = 'on_hold',
  REJECTED = 'rejected',
  PROCESSING = 'processing',
}

@Schema({timestamps: true})
export class Withdraw extends CoreEntity {

  @Prop({type: Number, required: true})
  amount: number;

  @Prop({type: String, required: true, enum: WithdrawStatus, default: WithdrawStatus.APPROVED})
  status: WithdrawStatus;

  @Prop({type:  mongoose.Schema.Types.ObjectId, ref: 'Shop'})
  shop_id: Shop;

  @Prop({type: {type: mongoose.Schema.Types.ObjectId, ref: 'Shop'}})
  shop: Shop;

  @Prop({type: String})
  payment_method: string;

  @Prop({type: String})
  details: string;

  @Prop({type: String})
  note: string;
}


const WithdrawSchema = SchemaFactory.createForClass(Withdraw)


export {WithdrawSchema}