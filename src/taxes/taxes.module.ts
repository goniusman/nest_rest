import { Module } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { TaxesController } from './taxes.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {TaxSchema} from './entities/tax.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Tax', schema: TaxSchema}])
  ],
  controllers: [TaxesController],
  providers: [TaxesService],
})
export class TaxesModule {}
