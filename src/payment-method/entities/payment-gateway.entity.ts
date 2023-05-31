import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';


@Schema({timestamps: true})
export class PaymentGateWay extends CoreEntity {

  @Prop({ required: false, type: String })
  user_id: number;

  @Prop({ required: false, type: String })
  customer_id: string;

  @Prop({ required: false, type: String })
  gateway_name: string;
}


const PaymentGateWaySchema = SchemaFactory.createForClass(PaymentGateWay)

export {PaymentGateWaySchema}