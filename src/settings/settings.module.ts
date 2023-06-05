import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import {MongooseModule} from '@nestjs/mongoose';
import { SettingSchema} from './entities/setting.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Setting', schema: SettingSchema}])
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
