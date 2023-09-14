import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { CoreEntity } from "src/common/entities/core.entity";



// @Schema({timestamps: false})
export class PaymentIntentInfo extends mongoose.Document {
  
  // @Prop({type: String, required: false})
  client_secret?: string | null;

  // @Prop({type: String, required: false})
  redirect_url?: string | null;

  // @Prop({type: String, required: false})
  payment_id: string;

  // @Prop({type: Boolean, required: false})
  is_redirect: boolean;

}



@Schema({timestamps: true})
export class PaymentIntent extends CoreEntity  {

  @Prop({type: Number, required: false})
  id: number;

  @Prop({type: Number, required: false})
  order_id: number;

  @Prop({type: String, required: false})
  tracking_number: string;

  @Prop({type: String, required: false})
  payment_gateway: string;
  
  @Prop({ required: false, type: PaymentIntentInfo, default: {}}) 
  payment_intent_info?: PaymentIntentInfo;

}



const PaymentIntentSchema = SchemaFactory.createForClass(PaymentIntent)

export { PaymentIntentSchema };
