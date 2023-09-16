import questionsJSON from '@db/questions.json';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {plainToClass} from 'class-transformer';
import Fuse from 'fuse.js';
import {Model} from 'mongoose';
import {paginate} from 'src/common/pagination/paginate';
import {CreateQuestionDto} from './dto/create-question.dto';
import {GetQuestionDto} from './dto/get-questions.dto';
import {UpdateQuestionDto} from './dto/update-question.dto';
import {Question} from './entities/question.entity';

const questions = plainToClass(Question, questionsJSON);
const options = {
  keys: [],
  threshold: 0.3,
};
const fuse = new Fuse(questions, options);

@Injectable()
export class QuestionService {
  private question: Question[] = questions;

constructor (@InjectModel('Question') private _questions: Model<Question>) {}


  async findAllQuestions({
    limit,
    page,
    search,
    answer,
    product_id,
  }: GetQuestionDto) {
    if (!page) page = 1;
    if (!limit) limit = 10;
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

    if (product_id) {
      data = data.filter((p) => p.product_id === Number(product_id));
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/questions?search=${search}&answer=${answer}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  findQuestion(id: any) {
    return this._questions.findById(id);
  }

  create(createQuestionDto: CreateQuestionDto) {
    return this._questions.create(createQuestionDto);
  }

  update(id: any, updateQuestionDto: UpdateQuestionDto) {
    return this._questions.findByIdAndUpdate(id, updateQuestionDto);
  }

  delete(id: any) {
    return this._questions.findByIdAndDelete(id);
  }
}
