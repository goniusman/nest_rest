import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
// import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
// import { CreateProfileDto } from './dto/create-profile.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { GetProfilesDto } from './dto/get-profile.dto';
import {ApiOkResponse} from '@nestjs/swagger';
// import { CreateProfileDto } from '../dto/create-profile.dto';
import {  Profile } from './schema/profile.schema';

import { CreateProfileDto } from './dto/create-profile.dto';

// import { IProfile } from '../interface/profile.interface';



@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Post()
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto) 
  }

  @Put(':id')
  updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    console.log(updateProfileDto);
  }

  // @Delete(':id')
  // deleteProfile(@Param('id') id: number) {
  //   // return this.profilesService.remove(id);
  // }
}
