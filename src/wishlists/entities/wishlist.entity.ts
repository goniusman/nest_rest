import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Schema({ timestamps: true })
export class Wishlist extends CoreEntity {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    default: [],
  })
  products_id: Product[] = [];

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Product',
  // })
  // product_id: Product;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;
}

const WishlistSchema = SchemaFactory.createForClass(Wishlist);

export { WishlistSchema };
