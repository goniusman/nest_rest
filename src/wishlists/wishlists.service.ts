import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginate } from 'src/common/pagination/paginate';
import { CreateWishlistDto } from './dto/create-wishlists.dto';
import { GetWishlistDto } from './dto/get-wishlists.dto';
import { UpdateWishlistDto } from './dto/update-wishlists.dto';
import { Wishlist } from './entities/wishlist.entity';
@Injectable()
export class WishlistsService {

  
  constructor(
    @InjectModel('Wishlist') private _wishlist: Model<Wishlist>
  ) {}


  create(createWishlistDto: CreateWishlistDto) {
    try {
      return this._wishlist.create(createWishlistDto)
    } catch (error) {
      throw error;
    }
  }

  async findAMyWishlists({ limit, page, search }: GetWishlistDto) {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let data: Wishlist[] = await this._wishlist.find().populate('products_id').populate('user');
    const results = data.slice(startIndex, endIndex);
    const url = `/my-wishlists?with=shop&orderBy=created_at&sortedBy=desc`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async findAMyWishlist(id: any) {
    return await this._wishlist.findById(id);
  }

  async update(id: any, updateWishlistDto: UpdateWishlistDto) {
    try {
      let wisItem = await this._wishlist.findOne({user: id});
      // wisItem.products_id.push(updateWishlistDto.products_id)
      return await this._wishlist.findOneAndUpdate(id, wisItem)
      
    } catch (error) {
      throw error;
    }
  }

  delete(id: any) {
    return this._wishlist.findByIdAndDelete(id);
  }

  async isInWishlist(product_id: any) {

    let isInWishlist = await this._wishlist.find({products_id:{ $in : {product_id}}})

    return isInWishlist;
  }

  toggle({ products_id }: CreateWishlistDto) {
    const wislis = this._wishlist.findById(products_id);

    // wislis.in_wishlist = !product?.in_wishlist;

    return {};
  }
}
