import { PickType } from '@nestjs/swagger';
import { Question } from '../entities/question.entity';

// export class CreateQuestionDto extends OmitType(Question, [
//   'id',
//   'product_id',
//   'user',
//   'created_at',
//   'updated_at',
// ])

{
}
export class CreateQuestionDto extends PickType(Question, []) {}
