import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

import typesJson from '@db/types.json';
import Fuse from 'fuse.js';
import { GetTypesDto } from './dto/get-types.dto';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

const types = plainToClass(Type, typesJson);
const options = {
  keys: ['name'],
  threshold: 0.3,
};
const fuse = new Fuse(types, options);

@Injectable()
export class TypesService {
  private types: Type[] = types;

  constructor(@InjectModel('Type') private _type : Model<Type>){}


  async create(createTypeDto: CreateTypeDto) {
    try {
      // const exist = await this._type.findOne({name: createTypeDto.name})

      // if(!exist){
        const createTyoe = await this._type.create(createTypeDto);
      // }

        return {
          ...createTypeDto,
        };

    } catch (error) {
      console.log(error);
    }
  }

  async getTypes({ text, search }: GetTypesDto) {
    // let data: Type[] = await this.types;
    let data: Type[] = await this._type.find();
    if (text?.replace(/%/g, '')) {
      data = fuse.search(text)?.map(({ item }) => item);
    }

    if (search) {
      const parseSearchParams = search.split(';');
      const searchText: any = [];
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // TODO: Temp Solution
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
    }

    return data;
  }

  async getTypeBySlug(slug: string): Promise< Type >{
    return await this._type.findOne({slug})
  }


  findOne(id: number) {
    return this._type.findById(id)
  }

  update(id: string, updateTypeDto: UpdateTypeDto) {
    return this._type.findByIdAndUpdate(id, updateTypeDto)
  }

  remove(id: string) {
    return this._type.findByIdAndRemove(id)
  }

}
