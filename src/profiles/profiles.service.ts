/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
// import { plainToClass } from 'class-transformer';
import { CreateProfileDto } from './dto/create-profile.dto';
// import {  ProfilePaginator } from './dto/get-profiles.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import Fuse from 'fuse.js';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {  Profile } from './schema/profile.schema';

// import { CreateProfileDto } from '../dto/create-profile.dto';
// import { IProfile } from '../interface/profile.interface';

// import { Profile } from './entities/profile.entity';
// import profilesJson from '@db/profiles.json';
import { paginate } from 'src/common/pagination/paginate';
// import {GetProfilesDto, ProfilePaginator} from './dto/get-profile.dto';
import {ApiOkResponse} from '@nestjs/swagger';
// const profiles = plainToClass(ProfileSchema, profilesJson);

// const options = {
//   keys: ['name', 'type.slug', 'categories.slug', 'status'],
//   threshold: 0.3,
// };
// const fuse = new Fuse(profiles, options);


@Injectable()
export class ProfilesService { 
  // private profiles: Profile[];

  constructor(
    @InjectModel('Profile')
    private profiles: Model<Profile>,
  ) {}

  // @InjectModel('Student') private studentModel:Model<IStudent>

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    // return this.profiles[0];
    // console.log('i ma here');
    const newStudent = await new this.profiles(createProfileDto);
    console.log(newStudent);
    return newStudent.save(); 
  }

  // async getProfiles({ text, limit, page, search }:GetProfilesDto): Promise<ProfilePaginator> {
  //   console.log(text);
  //   if (!page) page = 1;
  //   if (!limit) limit = 30;
  //   const startIndex = (page - 1) * limit;
  //   const endIndex = page * limit;
  //   // let data: IProfile[] = this.profiles;
  //   // if (text?.replace(/%/g, '')) {
  //   //   data = fuse.search(text)?.map(({ item }) => item);
  //   // }

  //   let profileData = await this.profiles.find();

  //   if (!profileData || profileData.length == 0) {
  //     throw new NotFoundException('Students data not found!');
  //   }

  //   //  profileData;

  //   if (search) {
  //     const parseSearchParams = search.split(';');
  //     const searchText: any = [];
  //     for (const searchParam of parseSearchParams) {
  //       const [key, value] = searchParam.split(':');
  //       // TODO: Temp Solution
  //       if (key !== 'slug') {
  //         searchText.push({
  //           [key]: value,
  //         });
  //       }
  //     }

  //     // profileData =  profileData
  //     //   .find({name: searchText})
  //     //   ?.map(({ item }) => item);
  //   }

  //   const results = profileData.slice(startIndex, endIndex);
  //   const url = `/profiles?limit=${limit}`;

  //   return {
  //     data: results,
  //     ...paginate(profileData.length, page, limit, results.length, url),
  //   };

  //   // return results
  // }

  async findOne(id: string) {
    // console.log(id);
    return await this.profiles.findById(id).exec();
    // return this.profiles.find((profile) => profile._id === id);
  }

  // async update(id: string, updateProfileDto: UpdateProfileDto) {
  //   return await this.profiles.findByIdAndUpdate(id, updateProfileDto)
  // }

  async remove(id: string) {
    return await this.profiles.deleteOne({_id: id})
  }

  // async makeAdmin(profile_id: string) {
  //   const profile = await this.profiles.findById({_id: profile_id});
  //   profile.is_active = !profile.is_active;
  //   return profile.save();
  // }

  // async banProfile(id: string) {
  //   const profile = await this.profiles.findById({_id: id});
  //   profile.is_active = !profile.is_active;
  //   return profile.save();
  // }

  // async activeProfile(id: string) {
  //   const profile = await this.profiles.findById({_id: id});
  //   // console.log(profile);
  //   profile.is_active = !profile.is_active;
  //   // profile.password = '12345'
  //   return profile.save();
  // }
}
