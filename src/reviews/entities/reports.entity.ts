import {Prop,SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {CoreEntity} from 'src/common/entities/core.entity';
import {User} from 'src/users/entities/user.entity';

export class Report extends CoreEntity {
  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: false})
  user_id?: number;

  @Prop({type: [{  type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: false}]})
  user: User[];

  @Prop({ required: false, type: Number })
  model_id: number;

  @Prop({ required: false, type: String })
  model_type: string;

  @Prop({ required: false, type: String })
  message: string;
}


const ReportSchema = SchemaFactory.createForClass(Report)

export {ReportSchema};
