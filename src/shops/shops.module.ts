import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import {
  ApproveShopController,
  DisapproveShopController,
  ShopsController,
  StaffsController,
} from './shops.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopSchema } from './entities/shop.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports:[
     MongooseModule.forFeature([{name: 'Shop', schema: ShopSchema}])
    ],
  controllers: [
    ShopsController,
    StaffsController,
    DisapproveShopController,
    ApproveShopController,
  ],
  providers: [ShopsService],
})
export class ShopsModule {}
