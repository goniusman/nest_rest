import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {CouponSchema} from './entities/coupon.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Coupon', schema: CouponSchema}])
  ],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
