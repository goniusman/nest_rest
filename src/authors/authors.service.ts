import { Injectable } from '@nestjs/common';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { plainToClass } from 'class-transformer';
import authorsJson from '@db/authors.json';
import { Author } from './entities/author.entity';
import Fuse from 'fuse.js';
import { GetAuthorDto } from './dto/get-author.dto';
import { paginate } from '../common/pagination/paginate';
import { GetTopAuthorsDto } from './dto/get-top-authors.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

const authors = plainToClass(Author, authorsJson);

const options = {
  keys: ['name', 'slug'],
  threshold: 0.3,
};

const fuse = new Fuse(authors, options);

@Injectable()
export class AuthorsService {
  private authors: Author[] = authors;

  constructor(@InjectModel('Author') private _author : Model<Author>){}
  
  
  async create(createAuthorDto: CreateAuthorDto) {
    try {
      const exist = await this._author.findOne({name: createAuthorDto.name})

      if(!exist){
        const createTag = await this._author.create(createAuthorDto);
      }

        return {
          ...createAuthorDto,
        };

    } catch (error) {
      console.log(error);
    }
  }

  async getAuthors({ page, limit, search }: GetAuthorDto) {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Author[] = await this._author.find();
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    const results = data.slice(startIndex, endIndex);

    const url = `/authors?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getAuthorBySlug(slug: string): Promise< Author> {
    return await this._author.findOne({slug});
  }

  async getTopAuthors({ limit = 10 }: GetTopAuthorsDto): Promise<Author[]> {
    return await this._author.find().limit(limit);
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {

    try {
      const author = await this._author.findById(id);
    // Update author
    author.is_approved = updateAuthorDto.is_approved ?? true;
    await this._author.findByIdAndUpdate(id, updateAuthorDto)
    return author;
    } catch (error) { 
      console.log(error);
    }
    
  }




  remove(id: string) {
    return  this._author.findByIdAndDelete(id)
  }
}
