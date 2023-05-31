import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';


export class TotalYearSaleByMonth {
  total?: number;
  month?: string;
}


@Schema({timestamps:true})
export class Analytics extends CoreEntity {

  @Prop({ required: false, type: Number })
  totalRevenue?: number;

  @Prop({ required: false, type: Number })
  totalShops?: number;

  @Prop({ required: false, type: Number })
  todaysRevenue?: number;

  @Prop({ required: false, type: Number })
  totalOrders?: number;

  @Prop({ required: false, type: Number })
  newCustomers?: number;

  @Prop({type: TotalYearSaleByMonth, default: [], required: false})
  totalYearSaleByMonth?: TotalYearSaleByMonth[];
}

const AnalyticsSchema = SchemaFactory.createForClass(Analytics)

export {AnalyticsSchema}