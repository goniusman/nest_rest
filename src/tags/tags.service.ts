import { Injectable } from '@nestjs/common';
import { paginate } from 'src/common/pagination/paginate';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagsDto } from './dto/get-tags.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import tagsJson from '@db/tags.json';
import { plainToClass } from 'class-transformer';
import Fuse from 'fuse.js';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {TypesService} from 'src/types/types.service';

const tags = plainToClass(Tag, tagsJson);

const options = {
  keys: ['name'],
  threshold: 0.3,
};

@Injectable()
export class TagsService {
  private tags: Tag[] = tags;

  constructor(
    @InjectModel('Tag') private _tag : Model<Tag>,
    // private _typeService: TypesService
      ){}

  async create(createTagDto: CreateTagDto) {

    try {
      const exist = await this._tag.findOne({name: createTagDto.name})

      if(!exist){
        const createTag = await this._tag.create(createTagDto);
      }

        return {
          id: this.tags.length + 1,
          ...createTagDto,
        };

    } catch (error) {
      console.log(error);
    }
   
  }

  async findAll({ page, limit, search }: GetTagsDto) {

    try {
      if (!page) page = 1;
    let data: Tag[] = await this._tag.find().populate('type');
    const fuse = new Fuse(data, options);


    if (search) {
      const parseSearchParams = search.split(';');
      const searchText: any = [];
      let searcValue: string;
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // TODO: Temp Solution
        searcValue = value
        if (key !== 'slug') {
          searchText.push({
            [key]: value,
          });
        }
      }

      data = fuse
        .search({
          $and: searchText,
        })
        ?.map(({ item }) => item);


        data = await this._tag.find({ "type.slug": searcValue}).populate('type').exec()
    }

    const url = `/tags?limit=${limit}`;
    return {
      data,
      ...paginate(this.tags.length, page, limit, this.tags.length, url),
    };
    } catch (error) {
      console.log(error);
    }
    
  }

  async findOne(param: string, language: string) {
    return await this._tag.findOne({slug: param});
  }



  async update(id: string, updateTagDto: UpdateTagDto) {
    return await this._tag.findByIdAndUpdate(id, updateTagDto);
  }

  remove(id: string) {
    return this._tag.findByIdAndDelete(id)
  }
}
