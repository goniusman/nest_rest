import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import Fuse from 'fuse.js';
import {Model} from 'mongoose';
import {paginate} from 'src/common/pagination/paginate';
import {CreateAttributeDto} from './dto/create-attribute.dto';
import {GetAttributesArgs} from './dto/get-attributes.dto';
import {UpdateAttributeDto} from './dto/update-attribute.dto';
import {Attribute} from './entities/attribute.entity';

// const attributes = plainToClass(Attribute, attributesJson);
const options = {
  keys: ['name', 'slug'],
  threshold: 0.3,
};


@Injectable()
export class AttributesService {
  // private attributes: Attribute[] = attributes;


  constructor(@InjectModel('Attribute') private _attr: Model<Attribute>) { }

  create(createAttributeDto: CreateAttributeDto) {
    // try {

    return this._attr.create(createAttributeDto);
    // } catch (error) {
    //   throw error
    // }

  }

  async findByName(param: string) {
    try {
      return (await this._attr.findOne({ name: param })).populate('shop user');

    } catch (error) {
      throw error
    }
    // return this.attributes.find(
    //   (p) => p.id === Number(param) || p.slug === param,
    // );
  }
 
  async findAll({ page, limit, search, shop }: GetAttributesArgs) {

      if (!page) page = 1;
      if (!limit) limit = 30;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      let data = await this._attr.find().populate('shop');
      const fuse = new Fuse(data, options);

      if(shop){
        data = await this._attr.find({shop}).populate('shop');
      }


      if (search) {
        const parseSearchParams = search.split(';');
        for (const searchParam of parseSearchParams) {
          const [key, value] = searchParam.split(':');
          data = fuse.search(value)?.map(({ item }) => item);
          //  let boll : boolean = value == '1' ? true : false;
          // data = await this._attr.find({ name: value }).exec()
        }
      }

      const results = data.slice(startIndex, endIndex);
      const url = `/attributes?search=${search}&limit=${limit}`;
      return {
        data: results,
        ...paginate(data.length, page, limit, results.length, url),
      };

  
  }

  findOne(param: string) {

    return this._attr.findOne({ slug: param }).populate('shop');
    // return this.attributes.find(
    //   (p) => p.id === Number(param) || p.slug === param,
    // );
  }

  findById(id: string) {
    try {
      return this._attr.findById(id).populate('shop');
    } catch (error) {
      throw error
    }
    // return this.attributes.find(
    //   (p) => p.id === Number(param) || p.slug === param,
    // );
  }

  update(id: string, updateAttributeDto: UpdateAttributeDto) {
    return this._attr.findByIdAndUpdate(id, updateAttributeDto);
  }

  remove(id: string) {
    return this._attr.findByIdAndDelete(id)
  }


}
