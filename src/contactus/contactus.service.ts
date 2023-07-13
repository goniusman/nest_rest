import { Injectable } from '@nestjs/common';
import { CreateContactusDto } from './dto/create-contactus.dto';
import { UpdateContactusDto } from './dto/update-contactus.dto';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Contactus} from './entities/contactus.entity';


@Injectable()
export class ContactusService {

  constructor(@InjectModel('Contactus') private _contactus : Model<Contactus>){}

  create(createContactusDto: CreateContactusDto) {
    return this._contactus.create(createContactusDto)
  }

  findAll() {
    return this._contactus.find()
  }

  findOne(id: string) {
    return this._contactus.findOne({_id: id})
  }


  async update(id: string, updateContactusDto: UpdateContactusDto) {
    // console.log(id);
    // console.log(updateContactusDto);
    const contactus = await this._contactus.findById(id)
    updateContactusDto.status = !contactus.status
    // updateContactusDto.updatedBy =
    return this._contactus.findByIdAndUpdate( id, updateContactusDto  )
  }

  remove(id: string) {
    return this._contactus.remove({_id: id})
  }
  
}
