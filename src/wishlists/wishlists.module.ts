import { Module } from '@nestjs/common';
import { MyWishlistsController } from './my-wishlists.controller';
import { MyWishlistService } from './my-wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistSchema } from './entities/wishlist.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Wishlist', schema: WishlistSchema}
    ])
  ],
  controllers: [WishlistsController, MyWishlistsController],
  providers: [WishlistsService, MyWishlistService],
})
export class WishlistsModule {}
