import shopsJson from '@db/shops.json';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import Fuse from 'fuse.js';
import { Model } from 'mongoose';
import { paginate } from 'src/common/pagination/paginate';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { GetShopsDto } from './dto/get-shops.dto';
import { GetStaffsDto } from './dto/get-staffs.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';

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
      const shopCreated = await this._shop.create(createShopDto);
      if(shopCreated._id){
         const updateShop = await this.userService.updateUserWithShopId(createShopDto.owner_id, shopCreated._id)
        if (updateShop) {
          return shopCreated;
        }else{
          return null;
        }

      }else{
        return null;
      }
     

    } catch (error) {
      throw error;
    }

  }

  async createStaff(staff: CreateUserDto) {
    try {

      // staff.permissions = [Permission.STAFF]
      staff.managed_shop = staff.shop_id;
      const createdStaff = await this.userService.create(staff)

      if(createdStaff._id){
      
          return createdStaff

      }else{
        throw new HttpException('Staff Not Created!', HttpStatus.BAD_REQUEST)
      }

    } catch (error) {
      throw error;
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

  async getShop(name: string): Promise<any> {
    return await this._shop.findOne({ slug:name });
  }


  async isAdminOrOwner(owner_id:any): Promise<boolean>{
    return await this.userService.isAdminOrOwner(owner_id);
  }


  getShopById(id: any) {
    // console.log(id);
    return this._shop.findById(id);
  }


  async update(id: string, updateShopDto: UpdateShopDto) {
    try {

      return await this._shop.findByIdAndUpdate(id, updateShopDto);
      
    } catch (error) {
      throw error
    }
  }


  async remove(id: string) {
    try {
    const shop = this._shop.findById(id)
    if(shop){
      return await this._shop.findByIdAndDelete(id);
    }else{
      throw new HttpException('This Shop not exist!', HttpStatus.BAD_REQUEST)
    }
    } catch (error) {
      throw error;
    }
   
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
