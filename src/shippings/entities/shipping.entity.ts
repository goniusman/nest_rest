import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';


export enum ShippingType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  FREE = 'free',
}
@Schema({timestamps: true})
export class Shipping extends CoreEntity {
  @Prop({type: String, required: true})
  name: string;

  @Prop({type: Number, required: true})
  amount: number;

  @Prop({type: Boolean, required: false})
  is_global: boolean;

  @Prop({type: String, required: true, enum: ShippingType, default: ShippingType.FIXED})
  type: ShippingType;
}


const ShippingSchema = SchemaFactory.createForClass(Shipping)


export {ShippingSchema}

