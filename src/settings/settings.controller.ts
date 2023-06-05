import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.settingsService.findAll();
  }


  @Put()
  update(@Body('id') id , @Body() udpateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(id, udpateSettingDto);
  }


}
