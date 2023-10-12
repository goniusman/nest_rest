import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetStoreNoticesDto } from './dto/get-store-notices.dto';
import { StoreNotice } from './entities/store-notices.entity';
import storeNoticesJson from '@db/store-notices.json';
import Fuse from 'fuse.js';
import { paginate } from 'src/common/pagination/paginate';
import { CreateStoreNoticeDto } from './dto/create-store-notice.dto';
import { UpdateStoreNoticeDto } from './dto/update-store-notice.dto';
import { GetUsersDto } from 'src/users/dto/get-users.dto';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const storeNotices = plainToClass(StoreNotice, storeNoticesJson);
const options = {
  keys: ['notice'],
  threshold: 0.3,
};
const fuse = new Fuse(storeNotices, options);

@Injectable()
export class StoreNoticesService {
  private storeNotices: StoreNotice[] = storeNotices;


  constructor(
    @InjectModel('StoreNotice') private storeNotice: Model<StoreNotice>,
    private readonly userService: UsersService
    ) {}


  async create(createStoreNoticeDto: CreateStoreNoticeDto) {
    return await this.storeNotice.create(createStoreNoticeDto);
  }

  async getStoreNotices({ search, limit, page }: GetStoreNoticesDto) {
    if (!page) page = 1;
    if (!limit) limit = 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data = await this.storeNotice.find().populate('created_by received_by');

    if (search) {
      const parseSearchParams = search.split(';');
      // const searchText: any = [];
      // for (const searchParam of parseSearchParams) {
      //   const [key, value] = searchParam.split(':');
      //   // TODO: Temp Solution
      //   if (key !== 'slug') {
      //     searchText.push({
      //       [key]: value,
      //     });
      //   }
      // }

      // data = fuse
      //   .search({
      //     $and: searchText,
      //   })
      //   ?.map(({ item }) => item);

      for (const [i, searchParam] of parseSearchParams.entries()) {
        // console.log( searchParam);
        if(searchParam.includes("shop_id")){
          const typeStr = parseSearchParams[i]
          const [key, value] = typeStr.split(':');
          // console.log(typeStr);
          //  data = await this.storeNotice.find({received_by: {"$in":[value]} })
          data = await this.storeNotice.find().exec();

        //  data = await data?.received_by.filter(item => item === value)


        }else if(searchParam.includes("notice")){
          const categoryStr = parseSearchParams[i]
          const [key, value] = categoryStr.split(':');
 
          data = await this.storeNotice.find({notice: {"$elemMatch":{'notice':value}}})
       
          
        }

      }



    }

    const results = data.slice(startIndex, endIndex);
    const url = `/store-notices?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getStoreNotice(param: string, language: string) {
    return this.storeNotice.findOne({_id: param}).populate('created_by received_by');
  }

  async getUsersNotify({ limit }: GetUsersDto) {
     return await this.userService.getUsersNotify();
  }

  update(id: any, updateStoreNoticeDto: UpdateStoreNoticeDto) {
    return this.storeNotice.findByIdAndUpdate(id, updateStoreNoticeDto);
  }

  remove(id: any) {
    return this.storeNotice.findByIdAndDelete(id);
  }
}
