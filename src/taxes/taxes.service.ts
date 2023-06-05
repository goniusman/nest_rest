import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { Tax } from './entities/tax.entity';
import taxesJson from '@db/taxes.json';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';

const taxes = plainToClass(Tax, taxesJson);

@Injectable()
export class TaxesService {
  private taxes: Tax[] = taxes;

  constructor(@InjectModel('Tax') private _tax : Model<Tax>){}

  async create(createTaxDto: CreateTaxDto) {
    try {
      const exist = await this._tax.findOne({name: createTaxDto.name})

      if(!exist){
        const createTag = await this._tax.create(createTaxDto);
      }

        return {
          ...createTaxDto,
        };

    } catch (error) {
      console.log(error);
    }
   
  }

  findAll() {
    const taxes = this._tax.find();
    // const te = "dsdf"
    // console.log(te);
    return taxes;
  }

  async findOne(id: string) {
    return await this._tax.findById(id);
  }

  update(id: string, updateTaxDto: UpdateTaxDto) {
    return this._tax.findByIdAndUpdate(id, updateTaxDto);
  }

  remove(id: string) {
    return this._tax.findByIdAndDelete(id)
  }
}
