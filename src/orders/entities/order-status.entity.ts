import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';

@Schema({timestamps: true})
export class OrderStatus extends CoreEntity {

  @Prop({type: String, required: true})
  name: string;

  @Prop({type: String, required: false})
  color: string;

  @Prop({type: Number, required: false})
  serial: number;

  @Prop({type: String, required: false})
  slug: string;

  @Prop({type: String, required: false})
  language: string;

  @Prop({type: String, required: false, default:[]})
  translated_languages: string[];
}


const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus)

export {OrderStatusSchema}