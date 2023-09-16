import tagsJson from '@db/tags.json';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {plainToClass} from 'class-transformer';
import Fuse from 'fuse.js';
import {Model} from 'mongoose';
import {paginate} from 'src/common/pagination/paginate';
import {CreateTagDto} from './dto/create-tag.dto';
import {GetTagsDto} from './dto/get-tags.dto';
import {UpdateTagDto} from './dto/update-tag.dto';
import {Tag} from './entities/tag.entity';


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


  async createTag(createTagDto: CreateTagDto) {

    try {  
     
      const tagC = await new this._tag(createTagDto);
      // categoryModel.slug = createCategoryDto.name;
      tagC.save()

        // const tagC = await this._tag.create(createTagDto);

        return tagC;

    } catch (error) { 
      throw error; 
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


        data = await this._tag.find({ "type.slug": searcValue}).populate('type')
    }

    const url = `/tags?limit=${limit}`;
    return {
      data,
      ...paginate(data.length, page, limit, data.length, url),
    };
    } catch (error) {
      console.log(error);
    }
    
  }

  async  findOne(param: string) {
    try {
      return await this._tag.findOne({name: param});
      
    } catch (error) {
      throw error;
    }
  }



  async update(id: string, updateTagDto: UpdateTagDto) {
    return await this._tag.findByIdAndUpdate(id, updateTagDto);
  }

  remove(id: string) {
    return this._tag.findByIdAndDelete(id)
  }
}
