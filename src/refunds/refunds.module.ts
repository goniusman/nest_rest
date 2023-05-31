import { Module } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { RefundsController } from './refunds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RefundSchema } from './entities/refund.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Refund', schema: RefundSchema}
    ])
  ],
  controllers: [RefundsController],
  providers: [RefundsService],
})
export class RefundsModule {}
