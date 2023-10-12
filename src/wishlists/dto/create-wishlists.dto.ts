import {PartialType} from '@nestjs/swagger';
import {Product} from 'src/products/entities/product.entity';
import {User} from 'src/users/entities/user.entity';
import {Wishlist} from '../entities/wishlist.entity';

export class CreateWishlistDto extends PartialType(Wishlist) {
  product_id?: Product;
  customer?: User;
}
