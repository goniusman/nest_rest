import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';  
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
 
import {  Address } from './entities/address.entity';
@Injectable()
export class AddressesService {

  constructor(
    @InjectModel('Address')
    private _address: Model<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    
    return await this._address.create(createAddressDto)
  }

  async findAll() {
    return await this._address.find().populate('customer')
  }

  async findOne(id: string) {
    return await this._address.findById(id).populate('customer')
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    return await this._address.findByIdAndUpdate(id, updateAddressDto).populate('customer')
  }

  remove(id: string) {
    return this._address.findByIdAndDelete(id)
  }
}
