import { Module } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import {
  ManufacturersController,
  TopManufacturersController,
} from './manufacturers.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {ManufacturerSchema} from './entities/manufacturer.entity';

@Module({
  imports : [
    MongooseModule.forFeature([
      {name: 'Manufacturer', schema: ManufacturerSchema}
    ])
  ],
  controllers: [ManufacturersController, TopManufacturersController],
  providers: [ManufacturersService],
  exports: [ManufacturersService]
})
export class ManufacturersModule {}
