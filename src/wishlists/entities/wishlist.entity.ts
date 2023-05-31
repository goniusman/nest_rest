import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Schema({timestamps: true})
export class Wishlist extends CoreEntity {

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Product' , required: false})
  product: Product;

  @Prop({ required: false, type: String })
  product_id: string;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], default: []})
  user: User[];

  @Prop({ required: false, type: String })
  user_id: string;

}


const WishlistSchema = SchemaFactory.createForClass(Wishlist)

export {WishlistSchema}