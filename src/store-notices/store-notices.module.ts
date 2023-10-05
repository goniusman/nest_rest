import { Module } from '@nestjs/common';
import { StoreNoticesController } from './store-notices.controller';
import { StoreNoticesService } from './store-notices.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreNoticeSchema } from './entities/store-notices.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'StoreNotice', schema: StoreNoticeSchema}]),
    UsersModule
  ],
  controllers: [StoreNoticesController],
  providers: [StoreNoticesService],
})
export class StoreNoticesModule {}
