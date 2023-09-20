/* eslint-disable prettier/prettier */
import {HttpService} from '@nestjs/axios';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import {BadRequestException,HttpException,HttpStatus,Inject,Injectable,Logger} from '@nestjs/common';
import {Cache} from 'cache-manager';
// import { plainToClass } from 'class-transformer';
import {CreateUserDto} from './dto/create-user.dto';
// import {  UserPaginator } from './dto/get-users.dto';
import {InjectModel} from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import Fuse from 'fuse.js';
import {Model} from 'mongoose';
import {CloudinaryService} from '../cloudinary/cloudinary.service';
import {User,UserDocument} from './entities/user.entity';
// import { CreateUserDto } from '../dto/create-user.dto';
// import { IUser } from '../interface/user.interface';

// import { User } from './entities/user.entity';
// import usersJson from '@db/users.json';
import {paginate} from 'src/common/pagination/paginate';
import {UploadsService} from 'src/uploads/uploads.service';
import {GetUsersDto,UserPaginator} from './dto/get-users.dto';
// const users = plainToClass(UserSchema, usersJson);

const options = {
  keys: ['name', '_id', 'permissions', 'is_active', 'email'],
  threshold: 0.3,
};

export enum Permission {
  SUPER_ADMIN = 'super_admin',
  STORE_OWNER = 'store_owner',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

@Injectable()
export class UsersService {
  // private users: User[];
  private readonly logger = new Logger();
  private NAME: string;
  constructor(
    @InjectModel(User.name)
    private users: Model<UserDocument>,
    private cloudinary: CloudinaryService,
    private uploader: UploadsService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    // private readonly configService: ConfigService
  ) {
    /// if env var is not specified use this technique
    //  const NAME = this.configService.get<string>('NMAILER_USER_NAME')
    //  if(!NAME) throw new Error('Mailer user name is not specified')
    //  this.NAME = NAME
  }

  // @InjectModel('Student') private studentModel:Model<IStudent>

  async create(createUserDto: CreateUserDto): Promise<any> {

    try {

      const saltOrRounds = 10;
      const hashPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
      const newStudent = await new this.users({
        ...createUserDto,
        password: hashPassword
      });
      return newStudent.save();

    } catch (error) {
      this.logger.error(`userService/create error is ${error.message}`)
      throw error;
    }

  }

  async getUsers({ text, limit, page, search }: GetUsersDto): Promise<UserPaginator> {

    try {
      
    if (!page) page = 1;
    if (!limit) limit = 3;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let userData = await this.users.find();

    if(userData || userData.length != 0) {

    const fuse = new Fuse(userData, options);

    if (text?.replace(/%/g, '')) {
      userData = fuse.search(text)?.map(({ item }) => item);
    }

    if (search) {
      const parseSearchParams = search.split(':');
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

      userData = fuse.search(parseSearchParams[1])?.map(({ item }) => item);;

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

  }else{
      throw new HttpException('Users Not found', HttpStatus.NOT_FOUND)
  }

  } catch (error) {
    this.logger.error(`userService/getUsers error is ${error.message}`)
    throw error;
  }


  }


  getUsersNotify({ limit }: GetUsersDto): User[] {
    const data: any = this.users;
    return data?.slice(0, limit);
  }


  async getUser(id: any): Promise<any> {
    try {
      const user = (await (await (await this.users.findOne({ _id: id }))?.populate('shops'))?.populate('managed_shop'))
      if (user) {
        return user;

      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }
    } catch (err) {
      this.logger.error(`userService/getUser user error: ${err.message}`);
      throw err;
    }


  }

  async getAllUsr() {
    // console.log(id);
    return await this.users.find().exec();
    // return this.users.find((user) => user._id === id);
  }

  async isAdminOrOwner(owner_id): Promise<boolean> {

    const user = await this.users.findById(owner_id)

    if(user.permissions.includes(Permission.STORE_OWNER) || user.permissions.includes(Permission.SUPER_ADMIN)){
      return true;
    }

    return false;
  }

  async getAllStaff(id) {
    // console.log(id);
    return await this.users.find({ managed_shop: id }).exec();
    // return this.users.find((user) => user._id === id);
  }

  async findById(id: string) {
    try {
      return await this.users.findById(id).exec();
    } catch (error) {
      throw error;
    }

  }

  async findByEmail(prop: string) {
    // console.log(id);
    return await this.users.findOne({ email: prop }).exec();
    // return await this.users.findOne({ email: prop }).exec();
    // return this.users.find((user) => user._id === id);
  }

  async update(id: string, updateUserDto: any) {

    try {

      const user = await this.findById(id)
      // const imageId = user?.profile?.avatar?.id
      // if (imageId) {
      //   const imageDoc = await this.uploader.findOne(imageId)
      //   const deletedImageCloud = await
      //     this.cloudinary.deleteCloudinaryImage(`${imageDoc?.public_id}.jpg`, imageDoc.signature)
      //   // console.log(deletedImageCloud);
      // }

      if (updateUserDto?.address) {
        user?.address.push(updateUserDto?.address[0])
        return await this.users.findByIdAndUpdate(id, user)
      } else {
        return await this.users.findByIdAndUpdate(id, updateUserDto)

      }


    } catch (error) {
      console.log(error);
    }

  }


  updatePhoneNumber(id: string, updateContent){
    return this.users.findByIdAndUpdate(id, updateContent)
  }

  async updateUserWithShopId(userId: any, shop: any): Promise<any> {

    try {
      const user = await this.findById(userId)
      user.shops.push(shop)
      return this.users.findByIdAndUpdate(userId, user)
    } catch (err) {
      console.log(err);
    }
  }

  async updatePassword(email: string, password: string): Promise<boolean> {

    try {
      const user = await this.findByEmail(email)
      const saltOrRounds = 10;
      const encPassword = await bcrypt.hash(password, saltOrRounds);
      user.password = encPassword;
      const update = await this.users.findOneAndUpdate({ email }, user)
      if (!update) {
        throw new Error('user not updated')
      } else {
        return true;
      }

    } catch (error) {
      return false;
    }

  }

  async remove(id: any): Promise<any> {
    return await this.users.deleteOne({ _id: id })
  }

  async assignORRevoke(user_id: string, user:any): Promise<any> {
    // const user = await this.users.findById({ _id: user_id });
    if (user.permissions.includes(Permission.SUPER_ADMIN)) {
      const deductAdmin = user.permissions.filter(item => {
        return item != Permission.SUPER_ADMIN
      })
      user.permissions = deductAdmin;
    } else {
      user.permissions = [...user.permissions, Permission.SUPER_ADMIN];
    }

    const updatedUser =  await user.save();
    return updatedUser;
  }

  async banUser(id: string) {
    const user = await this.users.findById({ _id: id });
    user.is_active = !user.is_active;
    return user.save();
  } 
  
  
  async removeAddress(id: string, usr) {
    const user = await this.users.findById({ _id: usr.id });
      let newAddress = {...user}.address.filter(address => address.id.toString() !== id)
      
      // user.address = newAddress

      // const newUser = {
      //   ...user,
      //   address: newAddress
      // }
      
      return await this.users.findByIdAndUpdate(usr.id, newAddress)
    
  }

  async updateEmailVerified(id: string) {

    try {
      const user = await this.users.findById(id);
      if (user != null) {
        user.email_verified_at = true;
        return await user.save();
      } else {
        throw new HttpException(`User ${id} does not exist`, HttpStatus.NOT_FOUND)
      }

    } catch (error) {
      this.logger.error(`/users/updateEmailVerifed error is ${error.message}`)
      return error;
    }


  }

  async activeUser(id: string) {

    const user = await this.users.findById({ _id: id });

    user.is_active = !user.is_active;

    return this.users.findByIdAndUpdate(  id,  user)
    // return this.users.aggregate([

    //   { $match: { _id: `ObjectId(${id})` } },
    //   { $set: { is_active: !user.is_active } }

    // ])

  }

  async profilePicture(file: Express.Multer.File) {
    const cloudinaryUpload = await this.cloudinary.uploadImage(file).catch((err) => {
      throw new BadRequestException(err);
    });
    return 'updated'

  }



  ////// testing for caching manager with redis //although not working properly
  async getSomeDate(): Promise<any> {
    console.log('not here');
    console.log(this.cacheService);
    const cachedData = await this.cacheService.get("test");
    console.log(cachedData);
    if (cachedData) {
      console.log('data set to cache', cachedData);
      return await `${cachedData}`;
    }
    const { data } = await this.httpService.axiosRef.get(
      `https://jsonplaceholder.typicode.com/todos/1`,
    );
    await this.cacheService.set("test", data);

    return data;

  }



}
