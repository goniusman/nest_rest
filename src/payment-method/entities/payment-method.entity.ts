import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { PaymentGateWay } from './payment-gateway.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';


@Schema({timestamps: true})
export class PaymentMethod extends CoreEntity {

  @Prop({ required: false, type: String })
  method_key: string;

  @Prop({ required: false, type: Boolean })
  default_card: boolean;

  @Prop({ required: false, type: Number})
  payment_gateway_id?: number;

  @Prop({ required: false, type: String })
  fingerprint?: string;

  @Prop({ required: false, type: String })
  owner_name?: string;

  @Prop({ required: false, type: String })
  network?: string;

  @Prop({ required: false, type: String })
  type?: string;

  @Prop({ required: false, type: String })
  last4?: string;

  @Prop({ required: false, type: String })
  expires?: string;

  @Prop({ required: false, type: String })
  origin?: string;

  @Prop({ required: false, type: String })
  verification_check?: string;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'PaymentGateWay' , required: false})
  payment_gateways?: PaymentGateWay;
}
const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod)

export {PaymentMethodSchema}