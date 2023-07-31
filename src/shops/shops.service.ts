import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { CreateUserDto, Permission } from 'src/users/dto/create-user.dto';

const shops = plainToClass(Shop, shopsJson);
const options = {
  keys: ['name', 'type.slug', 'is_active'],
  threshold: 0.3,
};


@Injectable()
export class ShopsService {
  private shops: Shop[] = shops;

  constructor(
    @InjectModel('Shop') private _shop: Model<Shop>,
    private userService: UsersService
  ) { }

  async create(createShopDto: CreateShopDto): Promise<any> {

    try {

      // const user = await this.userService.getUser(createShopDto.owner_id)
      // createShopDto.owner = user
      // createShopDto.slug = createShopDto.name
      const shopCreated = await this._shop.create(createShopDto);
      // user.shops.push(shopCreated._id)
      const updateShop = await this.userService.updateShop(createShopDto.owner_id, shopCreated._id)
      if (updateShop) {
        return shopCreated;
      }


    } catch (error) {
      console.log(error);
    }

  }

  async createStaff(staff: CreateUserDto) {
    try {

      staff.permissions = [Permission.STAFF]
      // staff.managed_shop = staff.shop_id;
      const createdStaff = await this.userService.create(staff)

      const shop = await this.getShopById(staff.managed_shop).exec()
      shop.staffs.push(createdStaff._id)
      await this.update(shop._id.toString(), shop)
      
      return createdStaff

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

  }

  async getShops({ search, limit, page }: GetShopsDto) {


    // this._shop.aggregate([{ $lookup: {
    //   from: 
    // }}])


    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let data: Shop[] = await this._shop.find().populate('owner_id');
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

  async getStaffs({ shop_id, limit, page }: GetStaffsDto) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let staffs = await this.userService.getAllUsr();
    if (shop_id) {
      staffs = await this.userService.getAllStaff(shop_id);
    }
    // const results = staffs?.limit( endIndex);
    const url = `/staffs?limit=${limit}`;

    return {
      data: staffs,
      ...paginate(staffs?.length, page, limit, staffs?.length, url),
    };
  }

  async getShop(slug: string): Promise<any> {
    return await this._shop.findOne({ slug });
  }

  getShopById(id: any) {
    // console.log(id);
    return this._shop.findById(id);
  }


  async update(id: string, updateShopDto: UpdateShopDto) {
    return await this._shop.findByIdAndUpdate(id, updateShopDto);
  }


  async remove(id: string) {
    return await this._shop.findByIdAndDelete(id);
  }

  async disapproveShop(id: any) {
    const shop = await this._shop.findById(id);
    // _shop.balance.admin_commission_rate = approveSho.admin_commission_rate;
    shop.is_active = false;
    await this._shop.findByIdAndUpdate(id, shop);
    return shop;
  }

  async approveShop(approveSho: any) {
    const shop = await this._shop.findById(approveSho.id);
    shop.balance.admin_commission_rate = approveSho.admin_commission_rate;
    // _shop.admin_commission_rate = approveSho.admin_commission_rate;
    // _shop.ApproveShop.id = approveSho.id;
    shop.is_active = true;
    await this._shop.findByIdAndUpdate(approveSho.id, shop);
    return shop;
  }

}
