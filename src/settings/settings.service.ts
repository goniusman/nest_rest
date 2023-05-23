import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
import settingsJson from '@db/settings.json';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

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
    return this.settings;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return this._setting.findByIdAndUpdate(id, updateSettingDto)
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
