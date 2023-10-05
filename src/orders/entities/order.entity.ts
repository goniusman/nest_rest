import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserAddress } from 'src/addresses/entities/address.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { PaymentIntent } from 'src/payment-intent/entries/payment-intent.entity';
import { File, OrderProductPivot, Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from './order-status.entity';

export enum PaymentGatewayType {
  STRIPE = 'STRIPE',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  CASH = 'CASH',
  FULL_WALLET_PAYMENT = 'FULL_WALLET_PAYMENT',
  PAYPAL = 'PAYPAL',
  RAZORPAY = 'RAZORPAY',
  BKASH = 'BKASH',
}

export enum OrderStatusType {
  PENDING = 'order-pending',
  PROCESSING = 'order-processing',
  COMPLETED = 'order-completed',
  CANCELLED = 'order-cancelled',
  REFUNDED = 'order-refunded',
  FAILED = 'order-failed',
  AT_LOCAL_FACILITY = 'order-at-local-facility',
  OUT_FOR_DELIVERY = 'order-out-for-delivery',
  DEFAULT_ORDER_STATUS = 'order-pendings',
}

export enum PaymentStatusType {
  PENDING = 'payment-pending',
  PROCESSING = 'payment-processing',
  SUCCESS = 'payment-success',
  FAILED = 'payment-failed',
  REVERSAL = 'payment-reversal',
  CASH_ON_DELIVERY = 'payment-cash-on-delivery',
  CASH = 'payment-cash',
  WALLET = 'payment-wallet',
  AWAITING_FOR_APPROVAL = 'payment-awaiting-for-approval',
  DEFAULT_PAYMENT_STATUS = 'payment-pendings',
}

@Schema({ timestamps: true })
export class Order extends CoreEntity {

  @Prop({ type: String, required: false, unique:true })
  tracking_number: string;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User', })
  customer: User;

  @Prop({ type: String, required: false })
  customer_contact: string;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  parent_order?: Order;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], default: [] })
  children: Order[];

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'OrderStatus', })
  status?: OrderStatus;

  @Prop({ required: false, type: String, enum: OrderStatusType })
  order_status: OrderStatusType;

  @Prop({ required: false, type: String, enum: PaymentStatusType })
  payment_status: PaymentStatusType;

  @Prop({ type: Number, required: false })
  amount: number;

  @Prop({ type: Number, required: false })
  sales_tax: number;

  @Prop({ type: Number, required: false })
  total: number;

  @Prop({ type: Number, required: false })
  paid_total: number;

  @Prop({ type: String, required: false })
  payment_id?: string;

  @Prop({ required: false, type: String, enum: PaymentGatewayType })
  payment_gateway: PaymentGatewayType;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', })
  coupon?: Coupon;

  // @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Shop', })
  // shop?: Shop;  
  
  @Prop({ required: false, type: String })
  shop?: string;

  @Prop({ type: Number, required: false })
  discount?: number;

  @Prop({ type: Number, required: false })
  delivery_fee: number;

  @Prop({ type: String, required: false })
  delivery_time: string;

  @Prop({ required: false, type: mongoose.Schema.Types.Array, default: [] })   
  products: OrderProductPivot[];

  @Prop({ required: false, type: UserAddress })
  billing_address: UserAddress;

  @Prop({ required: false, type: UserAddress })
  shipping_address: UserAddress;

  @Prop({ required: false, type: PaymentIntent })
  payment_intent: PaymentIntent;
  
  @Prop({ type: String, required: false, default: 'en' })
  language: string;

  @Prop({ type: String, required: false })
  translated_languages: string[];
  
}

const OrderSchema = SchemaFactory.createForClass(Order)

export { OrderSchema };

@Schema({ timestamps: true })
export class OrderFiles extends CoreEntity {

  @Prop({ type: String, required: false })
  purchase_key: string;

  @Prop({ type: Number, required: false })
  digital_file_id: number;

  @Prop({ type: Number, required: false })
  order_id?: number;

  @Prop({ type: Number, required: false })
  customer_id: number;

  @Prop({ required: false, type: File })
  file: File;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Product', })
  fileable: Product;
}



const OrderFilesSchema = SchemaFactory.createForClass(OrderFiles)

export { OrderFilesSchema };

