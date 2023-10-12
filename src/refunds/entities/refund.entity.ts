import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { User } from 'src/users/entities/user.entity';

export enum RefundStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
  PROCESSING = 'Processing',
}

@Schema({ timestamps: true })
export class Refund extends CoreEntity {
  
  @Prop({ required: false, type: String })
  title: string;

  @Prop({ required: false, type: String })
  description: string;

  @Prop({ required: false, type: Attachment })
  iamges: Attachment[];

  @Prop({
    required: false,
    type: String,
    enum: RefundStatus,
    default: RefundStatus.PENDING,
  })
  status: RefundStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: false })
  shop?: Shop;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false })
  order: Order;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  customer: User;
}

const RefundSchema = SchemaFactory.createForClass(Refund);

export { RefundSchema };
