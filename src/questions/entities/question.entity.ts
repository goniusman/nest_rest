import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Feedback } from '../../feedbacks/entities/feedback.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({timestamps:true})
export class Question extends CoreEntity {

  @Prop({ required: true, type: Number })
  user_id: number;

  @Prop({ required: false, type: Number })
  product_id: number;

  @Prop({ required: false, type: Number })
  shop_id: number;

  @Prop({ required: false, type: String })
  question?: string;

  @Prop({ required: false, type: String })
  answer: string;

  @Prop({ required: false, type: Number })
  positive_feedbacks_count?: number;

  @Prop({ required: false, type: Number })
  negative_feedbacks_count?: number;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Product' , required: false})
  product: Product;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: false})
  user: User;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Feedback'}], default: []})
  feedbacks?: Feedback[];

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' , required: false})
  my_feedback?: Feedback;


}



const QuestionSchema = SchemaFactory.createForClass(Question)

export {QuestionSchema}

