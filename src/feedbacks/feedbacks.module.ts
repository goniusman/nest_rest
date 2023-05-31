import { Module } from '@nestjs/common';
import { FeedbackController } from './feedbacks.controller';
import { FeedbackService } from './feedbacks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackSchema } from './entities/feedback.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Feedback', schema: FeedbackSchema }
    ]),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
