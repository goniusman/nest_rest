import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';

export enum WithdrawStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  ON_HOLD = 'On hold',
  REJECTED = 'Rejected',
  PROCESSING = 'Processing',
}

@Schema({timestamps: true})
export class Withdraw extends CoreEntity {

  @Prop({type: Number, required: true})
  amount: number;

  @Prop({type: String, required: true, enum: WithdrawStatus, default: WithdrawStatus.APPROVED})
  status: WithdrawStatus;

  @Prop({type: Number, required: false})
  shop_id: number;

  @Prop({type: {type: mongoose.Schema.Types.ObjectId, ref: 'Shop'}, required: false})
  shop: Shop;

  @Prop({type: String, required: false})
  payment_method: string;

  @Prop({type: String, required: false})
  details: string;

  @Prop({type: String, required: false})
  note: string;
}


const WithdrawSchema = SchemaFactory.createForClass(Withdraw)


export {WithdrawSchema}