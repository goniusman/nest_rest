import { Injectable } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Uploads} from './schema/Uploads';
import {Attachment} from 'src/common/entities/attachment.entity';

@Injectable()
export class UploadsService {

  constructor( @InjectModel("Uploads") private uploads: Model<Uploads> ){}


  async create(obj: any): Promise<any>{

    const upload = new this.uploads;
    upload.secure_url = obj.secure_url;
    upload.original_filename = obj.original_filename;
    upload.resource_type = obj.resource_type;
    upload.signature = obj.signature;
    upload.public_id = obj.public_id;
    upload.url = obj.url;
    upload.version_id = obj.version_id;
    const uploadedData = await upload.save();
    return uploadedData
  }

  findAll() {
    return `This action returns all uploads`;
  }

  async findOne(id: any) {
    return await this.uploads.findOne({id}).exec()
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
