import questionsJSON from '@db/questions.json';
import { Injectable, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import Fuse from 'fuse.js';
import { paginate } from 'src/common/pagination/paginate';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionDto } from './dto/get-questions.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { HasRoles } from 'src/auth/gurd/has-roles.decorator';
import { Role } from 'src/auth/gurd/role.enum';
import { RolesGuard } from 'src/auth/gurd/roles.guard';
import { JwtAuthGuard } from 'src/auth/gurd/jwt-auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const myQuestions = plainToClass(Question, questionsJSON);
const options = {
  keys: ['answer'],
  threshold: 0.3,
};
const fuse = new Fuse(myQuestions, options);

@Injectable()
export class MyQuestionsService {
  // private myQuestion: Question[] = myQuestions;

  constructor (@InjectModel('Question') private _questions: Model<Question>) {}


  async findMyQuestions({ limit, page, search, answer }: GetQuestionDto) {
    if (!page) page = 1;
    if (!limit) limit = 8;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Question[] = await this._questions.find();

    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    const results = data.slice(startIndex, endIndex);
    // const url = `/my-questions?search=${search}&answer=${answer}&limit=${limit}`;
    const url = `/my-questions?with=user&orderBy=created_at&sortedBy=desc`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  findMyQuestion(id: any) {
    return this._questions.findById(id);
  }

  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(createQuestionDto: CreateQuestionDto) {
    return this._questions[0];
  }

  update(id: any, updateQuestionDto: UpdateQuestionDto) {
    return this._questions.findOneAndUpdate(id, updateQuestionDto);
  }

  delete(id: any) {
    return this._questions.findByIdAndDelete(id);
  }
}
