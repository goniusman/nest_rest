import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';
import couponsJson from '@db/coupons.json';
import Fuse from 'fuse.js';
import { GetCouponsDto } from './dto/get-coupons.dto';
import { paginate } from 'src/common/pagination/paginate';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

const coupons = plainToClass(Coupon, couponsJson);
const options = {
  keys: ['code'],
  threshold: 0.3,
};
const fuse = new Fuse(coupons, options);

@Injectable()
export class CouponsService {
  private coupons: Coupon[] = coupons;
  
  constructor(@InjectModel('Coupon') private _coupon : Model<Coupon>){}

  async create(createCouponDto: CreateCouponDto) {
    try {
      const exist = await this._coupon.findOne({code: createCouponDto.code})

      if(!exist){
        const createTag = await this._coupon.create(createCouponDto);
      }

        return {
          ...createCouponDto,
        };

    } catch (error) {
      console.log(error);
    }
  }

  async getCoupons({ search, limit, page }: GetCouponsDto) {
    if (!page) page = 1;
    if (!limit) limit = 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Coupon[] = await this._coupon.find();
    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }

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

      data = fuse
        .search({
          $and: searchText,
        })
        ?.map(({ item }) => item);
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/coupons?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getCoupon(param: string, language: string): Promise< Coupon> {
    return await this._coupon.findOne({code: param})
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    return await this._coupon.findByIdAndUpdate(id, updateCouponDto);
  }

  remove(id: number) {
    return this._coupon.findByIdAndRemove(id)
  }

  verifyCoupon(code: string) {
    return {
      is_valid: true,
      coupon: {
        id: 9,
        code: code,
        description: null,
        image: {
          id: 925,
          original:
            'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/925/5x2x.png',
          thumbnail:
            'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/925/conversions/5x2x-thumbnail.jpg',
        },
        type: 'fixed',
        amount: 5,
        active_from: '2021-03-28T05:46:42.000Z',
        expire_at: '2024-06-23T05:46:42.000Z',
        created_at: '2021-03-28T05:48:16.000000Z',
        updated_at: '2021-08-19T03:58:34.000000Z',
        deleted_at: null,
        is_valid: true,
      },
    };
  }


}
