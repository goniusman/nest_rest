import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './entities/reports.entity';
import { ReviewSchema } from './entities/review.entity';
import { AbusiveReportsController } from './reports.controller';
import { AbusiveReportService } from './reports.service';
import { ReviewController } from './reviews.controller';
import { ReviewService } from './reviews.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Review', schema: ReviewSchema },
      { name: 'Report', schema: ReportSchema },
    ]),
  ],
  controllers: [ReviewController, AbusiveReportsController],
  providers: [ReviewService, AbusiveReportService],
})
export class ReviewModule {}
