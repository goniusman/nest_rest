import settingsJson from '@db/settings.json';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';
import { CreateSettingDto } from './dto/create-setting.dto';
import { Setting } from './entities/setting.entity';

const settings = plainToClass(Setting, settingsJson);

@Injectable()
export class SettingsService {
  private settings: Setting = settings;

  constructor(@InjectModel('Setting') private _setting : Model<Setting>){}

  async create(createSettingDto: CreateSettingDto) {
    try {
        const createTyoe = await this._setting.create(createSettingDto);
        return {
          ...createSettingDto,
        };

    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return this._setting.find();
  }

  async update(id, updateSettingDto) {
    // return await this._setting.findByIdAndUpdate(id, updateSettingDto)
    return await this._setting.updateOne(updateSettingDto)
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }

}
