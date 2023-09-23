import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  // @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'OrderStatus', })
  // status?: OrderStatus;
}
