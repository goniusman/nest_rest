import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateRefundDto} from './dto/create-refund.dto';
import {UpdateRefundDto} from './dto/update-refund.dto';
import {Refund} from './entities/refund.entity';

@Injectable()
export class RefundsService {


  constructor (@InjectModel('') private _refund : Model<Refund>) {
    
  }


  create(createRefundDto: CreateRefundDto) {
    return this._refund.create(createRefundDto)
  }

  findAll() {
    return this._refund.find()
  }

  findOne(id: any) {
    return this._refund.findById(id)
  }

  update(id: any, updateRefundDto: UpdateRefundDto) {
    return this._refund.findByIdAndUpdate(id, updateRefundDto)
  }

  remove(id: any) {
    return this._refund.findByIdAndDelete(id)
  }
}
