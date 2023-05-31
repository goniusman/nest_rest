import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsSchema } from './entities/analytics.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Analytics', schema: AnalyticsSchema}
    ])
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
