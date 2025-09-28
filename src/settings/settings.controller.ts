import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  Logger,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Settings")
@Controller('settings')
export class SettingsController {
  private readonly logger = new Logger();
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }


  @Put()
  update(@Body('id') id , @Body() udpateSettingDto: UpdateSettingDto) {
    try {
      
      return this.settingsService.update(id, udpateSettingDto);
    } catch (error) {

      this.logger.error(`settings/update failed: ${error}`)
      throw error
    }
  }


}
