import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';
import shopsJson from '@db/shops.json';
import Fuse from 'fuse.js';
import { GetShopsDto } from './dto/get-shops.dto';
import { paginate } from 'src/common/pagination/paginate';
import { GetStaffsDto } from './dto/get-staffs.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

const shops = plainToClass(Shop, shopsJson);
const options = {
  keys: ['name', 'type.slug', 'is_active'],
  threshold: 0.3,
};


@Injectable()
export class ShopsService {
  private shops: Shop[] = shops;

  constructor(
    @InjectModel('Shop') private shop : Model<Shop>,
    private userService: UsersService
  ) {}
  
  async create(createShopDto: CreateShopDto): Promise<any> {

    try {

      // const user = await this.userService.getUser(createShopDto.owner_id)
      // createShopDto.owner = user
      // createShopDto.slug = createShopDto.name
      const shopCreated = await this.shop.create(createShopDto);
      // user.shops.push(shopCreated._id)
      const updateShop = await this.userService.updateShop(createShopDto.owner_id, shopCreated._id)
      if (updateShop) {
          return shopCreated;
      }


    } catch (error) {
      console.log(error);
    }
   
  }

  async getShops({ search, limit, page }: GetShopsDto) {
   


    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    
    let data: Shop[] = await this.shop.find().populate('owner_id');
    // console.log(data);
    const fuse = new Fuse(data, options);
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // data = data.filter((item) => item[key] === value);
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }
    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }


for (const item of data) {
  // const owner = await this.userService.findById(item.owner_id)
}


    const results = data.slice(startIndex, endIndex);
    const url = `/shops?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getStaffs({ shop_id, limit, page }: GetStaffsDto) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let staffs: Shop['staffs'] = [];
    if (shop_id) {
      staffs = this.shops.find((p) => p.id === Number(shop_id))?.staffs ?? [];
    }
    const results = staffs?.slice(startIndex, endIndex);
    const url = `/staffs?limit=${limit}`;

    return {
      data: results,
      ...paginate(staffs?.length, page, limit, results?.length, url),
    };
  }

  async getShop(slug: string): Promise< any> {
    return await this.shop.findOne({slug});
  }

   getShopById(id: any){
    // console.log(id);
    return  this.shop.findById(id);
  }


  async update(id: string, updateShopDto: UpdateShopDto) {
    return await this.shop.findByIdAndUpdate(id, updateShopDto);
  }

  approve(id: string) {
    return `This action removes a #${id} shop`;
  }

  remove(id: string) {
    return `This action removes a #${id} shop`;
  }

  async disapproveShop(id: any) {
    const shop = await this.shop.findById(id);
    // shop.ApproveShop.admin_commission_rate = approveSho.admin_commission_rate;
    shop.is_active = false;
    await this.shop.findByIdAndUpdate(id, shop);
    return shop;
  }

  async approveShop(approveSho: any) {
    const shop = await this.shop.findById(approveSho.id);
    shop.admin_commission_rate = approveSho.admin_commission_rate;
    // shop.ApproveShop.id = approveSho.id;
    shop.is_active = true;
    await this.shop.findByIdAndUpdate(approveSho.id, shop);
    return shop;
  }

}
