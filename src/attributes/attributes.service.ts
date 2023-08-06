import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import attributesJson from '@db/attributes.json';
import { Attribute } from './entities/attribute.entity';
import { plainToClass } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const attributes = plainToClass(Attribute, attributesJson);

@Injectable()
export class AttributesService {
  private attributes: Attribute[] = attributes;


  constructor(@InjectModel('Attribute') private _attr : Model<Attribute>){}

  create(createAttributeDto: CreateAttributeDto) {
    // try {
      
      return this._attr.create(createAttributeDto);
    // } catch (error) {
    //   throw error
    // }
    
  }

  async findByName(param: string) {
    try {
      return await this._attr.findOne({name: param});
      
    } catch (error) {
      throw error
    }
    // return this.attributes.find(
    //   (p) => p.id === Number(param) || p.slug === param,
    // );
  }

  async findAll() {
    try {
      return await this._attr.find().populate('shop');
      
    } catch (error) {
      throw error
    }
  }

  findOne(param: string) {

    return this._attr.findOne({slug: param});
    // return this.attributes.find(
    //   (p) => p.id === Number(param) || p.slug === param,
    // );
  }
  
  findById(id: string) {
    try {
      
      return this._attr.findById(id);
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
