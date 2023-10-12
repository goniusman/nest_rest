import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRefundDto } from './dto/create-refund.dto';
import { UpdateRefundDto } from './dto/update-refund.dto';
import { Refund } from './entities/refund.entity';

@Injectable()
export class RefundsService {

  constructor (@InjectModel('Refund') private _refund : Model<Refund>) {
    
  }

 
  create(createRefundDto: CreateRefundDto, user: any) {
    createRefundDto.customer = user.id
    return this._refund.create(createRefundDto)
  }

  async findAll(user_id: any) {
    try {
         let refunds = []
    if(user_id){
      refunds =  await this._refund.find({customer:user_id}).populate('order customer')

    }else{
      refunds =  await this._refund.find().populate('order customer')

    }
    return refunds;
    } catch (error) {
      throw error;
    }
 
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
