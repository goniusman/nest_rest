import { Module } from '@nestjs/common';
import { StoreNoticesController } from './store-notices.controller';
import { StoreNoticesService } from './store-notices.service';

@Module({
  controllers: [StoreNoticesController],
  providers: [StoreNoticesService],
})
export class StoreNoticesModule {}
