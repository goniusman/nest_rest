/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
// import {  UserPaginator } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import Fuse from 'fuse.js';
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {  User } from './schema/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
// import { CreateUserDto } from '../dto/create-user.dto';
// import { IUser } from '../interface/user.interface';

// import { User } from './entities/user.entity';
// import usersJson from '@db/users.json';
import { paginate } from 'src/common/pagination/paginate';
import {GetUsersDto, UserPaginator} from './dto/get-users.dto';
import {ApiOkResponse} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import {UploadsService} from 'src/uploads/uploads.service';
// const users = plainToClass(UserSchema, usersJson);

// const options = {
//   keys: ['name', 'type.slug', 'categories.slug', 'status'],
//   threshold: 0.3,
// };
// const fuse = new Fuse(users, options);

export enum Permission {
  SUPER_ADMIN = 'super_admin',
  STORE_OWNER = 'store_owner',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

@Injectable()
export class UsersService { 
  // private users: User[];

  private NAME : string;
  constructor(
    @InjectModel('User')
    private users: Model<User>,
    private cloudinary: CloudinaryService,
    private uploader: UploadsService
    // private readonly configService: ConfigService
  ) {

    /// if env var is not specified use this technique
    //  const NAME = this.configService.get<string>('NMAILER_USER_NAME')
    //  if(!NAME) throw new Error('Mailer user name is not specified')
    //  this.NAME = NAME

  }

  // @InjectModel('Student') private studentModel:Model<IStudent>

  async create(createUserDto: CreateUserDto): Promise<any> {

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

    const userData = await this.users.find();

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

  async getUser(id: any) {
    // console.log(id);
    // console.log(await this.users.findById(id));
    return await this.users.findById(id).exec();
    // const user = await this.users.findById(id).exec();
    //  const {password, ...result} = user
    //  return result;
    // return this.users.find((user) => user._id === id);
  } 
  
  
  async getAllUsr() {
    // console.log(id);
    return await this.users.find().exec();
    // return this.users.find((user) => user._id === id);
  }

  async findOne(id: string) {
    // console.log(id);
    return await this.users.findById(id).exec();
    // return this.users.find((user) => user._id === id);
  }

  async findByEmail(prop: string) { 
    // console.log(id);
    return await this.users.findOne({email:prop}).exec();
    // return this.users.find((user) => user._id === id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {


      try {

        const user = await this.findOne(id)
        const imageId = user?.profile?.avatar?.id
        if (imageId) {
         const imageDoc = await this.uploader.findOne(imageId)

         const deletedImageCloud = await this.cloudinary.deleteCloudinaryImage(`${imageDoc.public_id}.jpg`, imageDoc.signature)
          console.log(deletedImageCloud);
        }

        return await this.users.findByIdAndUpdate(id, updateUserDto)
        
      } catch (error) {
        console.log(error);
      }
 
  }


  async updatePassword(email: string, password: string): Promise<boolean> {

      try {
        const user = await this.findByEmail(email)
        const saltOrRounds = 10;
        const encPassword = await bcrypt.hash(password, saltOrRounds);
        user.password = encPassword;
        const update = await this.users.findOneAndUpdate({email}, user)
        if(!update) {
          throw new Error('user not updated')
        }else{
          return true;
        }

      } catch (error) {
        return false;
      }

  }


  async remove(id: string) { 
    return await this.users.deleteOne({_id: id})
  }

  async makeAdmin(user_id: string) {
    const user = await this.users.findById({_id: user_id});
    if(user.permissions.includes(Permission.SUPER_ADMIN)){
      const deductAdmin = user.permissions.filter(item => {
        return item != Permission.SUPER_ADMIN
      })
     user.permissions = deductAdmin;
    }else{
        user.permissions = [...user.permissions, Permission.SUPER_ADMIN];
    }
  
    return await user.save();
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

  async profilePicture(file: Express.Multer.File) {
    const cloudinaryUpload =  await this.cloudinary.uploadImage(file).catch((err) => {
      throw new BadRequestException(err);
    });



    return 'updated'



  }
}
