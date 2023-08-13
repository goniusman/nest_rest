import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';

export enum CouponType {
  FIXED_COUPON = 'fixed',
  PERCENTAGE_COUPON = 'percentage',
  FREE_SHIPPING_COUPON = 'free_shipping',
  DEFAULT_COUPON = 'fixeds',
}

@Schema({ timestamps: true })
export class Coupon extends CoreEntity {

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true })
  description?: string;

  @Prop({ type: Number, required: true })
  minimum_cart_amount: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], required: false, default: [] })
  orders?: Order[];

  @Prop({ type: String, enum: CouponType, required: false, default: CouponType.FIXED_COUPON })
  type: CouponType;

  @Prop({ type: Attachment, required: false })
  image: Attachment;

  @Prop({ type: Boolean, required: false })
  is_valid: boolean;

  @Prop({ type: Number, required: false })
  amount: number;

  @Prop({ type: String, required: true })
  active_from: string;

  @Prop({ type: String, required: true })
  expire_at: string;

  @Prop({ type: String, required: false })
  language: string;

  @Prop({ type: [String], required: false })
  translated_languages: string[];
}


const CouponSchema = SchemaFactory.createForClass(Coupon)


export { CouponSchema };
