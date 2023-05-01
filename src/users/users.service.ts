/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
// import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
// import {  UserPaginator } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import Fuse from 'fuse.js';
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {  User } from './schema/user.schema';

// import { CreateUserDto } from '../dto/create-user.dto';
// import { IUser } from '../interface/user.interface';

// import { User } from './entities/user.entity';
// import usersJson from '@db/users.json';
import { paginate } from 'src/common/pagination/paginate';
import {GetUsersDto, UserPaginator} from './dto/get-users.dto';
import {ApiOkResponse} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
// const users = plainToClass(UserSchema, usersJson);

// const options = {
//   keys: ['name', 'type.slug', 'categories.slug', 'status'],
//   threshold: 0.3,
// };
// const fuse = new Fuse(users, options);


@Injectable()
export class UsersService { 
  // private users: User[];

  private NAME : string;
  constructor(
    @InjectModel('User')
    private users: Model<User>,
    // private readonly configService: ConfigService
  ) {

    /// if env var is not specified use this technique
    //  const NAME = this.configService.get<string>('NMAILER_USER_NAME')
    //  if(!NAME) throw new Error('Mailer user name is not specified')
    //  this.NAME = NAME

  }

  // @InjectModel('Student') private studentModel:Model<IStudent>

  async create(createUserDto: CreateUserDto): Promise<User> {

    ////////
    // const NMAILER_NAME = this.configService.get<string>('NMAILER_USER_NAME')
    // console.log(NMAILER_NAME);
  // async create(createUserDto: CreateUserDto) {
    // return this.users[0];
    let {password} = createUserDto
    const saltOrRounds = 10;
    password = await bcrypt.hash(password, saltOrRounds);
    createUserDto.password = password;
    // console.log(createUserDto);
    const newStudent = await new this.users(createUserDto);

    return newStudent.save();

    //  return {
    //   msg: "user created successfully",
    //   userId: newStudent._id
    //  }
  }

  async getUsers({ text, limit, page, search }:GetUsersDto): Promise<UserPaginator> {
    console.log(text);
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // let data: IUser[] = this.users;
    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }

    let userData = await this.users.find();

    if (!userData || userData.length == 0) {
      throw new NotFoundException('Students data not found!');
    }

    //  userData;

    if (search) {
      const parseSearchParams = search.split(';');
      const searchText: any = [];
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // TODO: Temp Solution
        if (key !== 'slug') {
          searchText.push({
            [key]: value,
          });
        }
      }

      // userData =  userData
      //   .find({name: searchText})
      //   ?.map(({ item }) => item);
    }

    const results = userData.slice(startIndex, endIndex);
    const url = `/users?limit=${limit}`;

    return {
      data: results,
      ...paginate(userData.length, page, limit, results.length, url),
    };

    // return results
  }

  async getUser(id: string) {
    // console.log(id);
    return await this.users.findById(id).exec();
    // return this.users.find((user) => user._id === id);
  }

  async findOne(id: string) {
    // console.log(id);
    return await this.users.findById(id).exec();
    // return this.users.find((user) => user._id === id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.users.findByIdAndUpdate(id, updateUserDto)
  }

  async remove(id: string) {
    return await this.users.deleteOne({_id: id})
  }

  async makeAdmin(user_id: string) {
    const user = await this.users.findById({_id: user_id});
    user.is_active = !user.is_active;
    return user.save();
  }

  async banUser(id: string) {
    const user = await this.users.findById({_id: id});
    user.is_active = !user.is_active;
    return user.save();
  }

  async activeUser(id: string) {
    const user = await this.users.findById({_id: id});
    // console.log(user);
    user.is_active = !user.is_active;
    // user.password = '12345'
    return user.save();
  }
}
