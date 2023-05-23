import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { GetShippingsDto } from './dto/get-shippings.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { Shipping } from './entities/shipping.entity';
import shippingsJson from '@db/shippings.json';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

const shippings = plainToClass(Shipping, shippingsJson);

@Injectable()
export class ShippingsService {
  private shippings: Shipping[] = shippings;

  constructor(@InjectModel('Shipping') private _shiping : Model<Shipping>){}

  async create(createShippingDto: CreateShippingDto) {
    try {
      const exist = await this._shiping.findOne({name: createShippingDto.name})

      if(!exist){
        const createTag = await this._shiping.create(createShippingDto);
      }

        return {
          ...createShippingDto,
        };

    } catch (error) {
      console.log(error);
    }
  }

  getShippings({}: GetShippingsDto) {
    return this._shiping.find();
  }

  findOne(id: number) {
    return this._shiping.findById(id);
  }

  update(id: number, updateShippingDto: UpdateShippingDto) {
    return this._shiping.findByIdAndUpdate(id, updateShippingDto)
  }

  remove(id: number) {
    return this._shiping.findByIdAndDelete(id)
  }
}
