import { Injectable } from '@nestjs/common';
import { Manufacturer } from './entities/manufacturer.entity';
import manufacturersJson from '@db/manufacturers.json';
import { plainToClass } from 'class-transformer';
import Fuse from 'fuse.js';
import { GetTopManufacturersDto } from './dto/get-top-manufacturers.dto';
import {
  GetManufacturersDto,
  ManufacturerPaginator,
} from './dto/get-manufactures.dto';
import { paginate } from '../common/pagination/paginate';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

const manufacturers = plainToClass(Manufacturer, manufacturersJson);

const options = {
  keys: ['name'],
  threshold: 0.3,
};

const fuse = new Fuse(manufacturers, options);

@Injectable()
export class ManufacturersService {
  private manufacturers: Manufacturer[] = manufacturers;

  constructor(@InjectModel('Manufacturer') private _manufacturer: Model<Manufacturer>){}


  async create(createManufactureDto: CreateManufacturerDto) {
    
    try {
      // const exist = await this._manufacturer.findOne({shop_id: createManufactureDto.shop_id})

      // if(!exist){
        const createMenufac = await this._manufacturer.create(createManufactureDto);
      // }

        // return {
        //   id: this._manufacturer.length + 1,
        //   ...createManufactureDto,
        // };
      return createMenufac
      
    } catch (error) {
      console.log(error);
    }
  }

  async getManufactures({
    limit,
    page,
    search,
  }: GetManufacturersDto): Promise<ManufacturerPaginator> {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Manufacturer[] = await this._manufacturer.find().exec();
    if (search) {
      console.log('search', search);
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/manufacturers?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getTopManufactures({
    limit = 10,
  }: GetTopManufacturersDto): Promise<Manufacturer[]> {
    return manufacturers.slice(0, limit);
  }

  async getManufacturesBySlug(slug: string): Promise<Manufacturer> {
    return await this._manufacturer.findOne({slug});
  } 
  
  async getManufacturesById(id: any): Promise<Manufacturer> {
    return await this._manufacturer.findById(id);
  }

  update(id: string, updateManufacturesDto: UpdateManufacturerDto) {
    const manufacturer = this._manufacturer.findByIdAndUpdate(id, updateManufacturesDto);

    // Update author
    // manufacturer.is_approved = updateManufacturesDto.is_approved ?? true;

    return manufacturer;
  }

  remove(id: string) {
    return this._manufacturer.findByIdAndDelete(id);
  }
}
