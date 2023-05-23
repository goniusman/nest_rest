import {Prop, SchemaFactory, Schema} from '@nestjs/mongoose';

import { CoreEntity } from 'src/common/entities/core.entity';

@Schema({timestamps: true})
export class Tax extends CoreEntity {

  @Prop({type: String, required: true})
  name: string;

  @Prop({type: Number, required: true})
  rate: number;

  @Prop({type: Boolean, required: false})
  is_global: boolean;

  @Prop({type: String, required: true})
  country?: string;

  @Prop({type: String, required: false})
  state?: string;

  @Prop({type: String, required: false})
  zip?: string;

  @Prop({type: String, required: false})
  city?: string;

  @Prop({type: Number, required: false})
  priority?: number;

  @Prop({type: Boolean, required: false})
  on_shipping: boolean;
}


const TaxSchema = SchemaFactory.createForClass(Tax)


export {TaxSchema}