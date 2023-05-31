import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { Report } from './reports.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';


@Schema({timestamps:true})
export class Review extends CoreEntity {

  @Prop({ required: true, type: Number })
  rating: number;

  @Prop({ required: false, type: String })
  name: string;

  @Prop({ required: false, type: String })
  comment: string;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Shop' , required: false})
  shop: Shop;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Order' , required: false})
  order: Order;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: false})
  customer: User;

  @Prop({  type: Attachment, required: false})
  photos: Attachment[];

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: false})
  user: User;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Product' , required: false})
  product: Product;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Feedback'}], default: []})
  feedbacks: Feedback[];

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' , required: false})
  my_feedback: Feedback;

  @Prop({ required: false, type: Number })
  positive_feedbacks_count: number;

  @Prop({ required: false, type: Number })
  negative_feedbacks_count: number;

  @Prop({ required: false, type: Number })
  user_id: number;

  @Prop({ required: false, type: Number })
  product_id: number;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Report'}], default: []})
  abusive_reports: Report[];

  
  @Prop({ required: false, type: String })
  shop_id: string;

  
  @Prop({ required: false, type: String })
  variation_option_id: string;

  @Prop({ required: false, type: Number })
  abusive_reports_count?: number;

}


const ReviewSchema = SchemaFactory.createForClass(Review)

export {ReviewSchema}