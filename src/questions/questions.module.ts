import { Module } from '@nestjs/common';
import { MyQuestionsController } from './my-questions.controller';
import { MyQuestionsService } from './my-questions.service';
import { QuestionController } from './questions.controller';
import { QuestionService } from './questions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionSchema } from './entities/question.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Question', schema: QuestionSchema}
    ])
  ],
  controllers: [QuestionController, MyQuestionsController],
  providers: [QuestionService, MyQuestionsService],
})
export class QuestionModule {}
