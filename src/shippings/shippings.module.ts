import { Module } from '@nestjs/common';
import { ShippingsService } from './shippings.service';
import { ShippingsController } from './shippings.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {ShippingSchema} from './entities/shipping.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Shipping', schema: ShippingSchema}])
  ],
  controllers: [ShippingsController],
  providers: [ShippingsService],
})
export class ShippingsModule {}
