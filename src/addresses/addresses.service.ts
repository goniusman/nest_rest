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
    private users: Model<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    
    return 'This action adds a new address';
  }

  findAll() {
    return `This action returns all addresses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return [];
  }
}
