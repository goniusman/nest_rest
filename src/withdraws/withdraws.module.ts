import { Module } from '@nestjs/common';
import { WithdrawsService } from './withdraws.service';
import { WithdrawsController } from './withdraws.controller';
import {WithdrawSchema} from './entities/withdraw.entity';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Withdraw', schema: WithdrawSchema}])
  ],
  controllers: [WithdrawsController],
  providers: [WithdrawsService],
})
export class WithdrawsModule {}
