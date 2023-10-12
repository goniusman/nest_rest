import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { User } from 'src/users/entities/user.entity';

export enum StoreNoticePriorityType {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}
@Schema({timestamps: true})
export class StoreNotice extends CoreEntity {
  
  @Prop({type: String, enum: StoreNoticePriorityType})
  priority: StoreNoticePriorityType;

  @Prop({type: String, required: true})
  notice: string;

  @Prop({type: String, required: true})
  description?: string;

  @Prop({type: String, required: true})
  effective_from?: string;

  @Prop({type: String, required: true})
  expired_at: string;

  @Prop({type: String, required: false})
  type?: string;

  @Prop({type: String, required: false})
  is_read?: boolean;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: false}], default: []})
  shops?: Shop[];

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: false}], default: []})
  users?: User[];

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: false}], default: []})
  received_by: User;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "User", required: false})
  created_by: string;

  @Prop({type: Date, required: false})
  expire_at: string;

  @Prop({type: Date, required: false})
  deleted_at?: string;

  @Prop({type: String, required: false})
  creator?: any;


  @Prop({type: String, required: false})
  language: string;

  @Prop({type: [String], required: false})
  translated_languages: string[];

}

const StoreNoticeSchema = SchemaFactory.createForClass(StoreNotice)

export {StoreNoticeSchema}
