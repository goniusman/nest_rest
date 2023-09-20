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

  async delete(id: any, user: any) {
    
      
      try {
        let userWishlist = await this._wishlist.findOne({user: user.id})
        if(userWishlist){
          
            if(!userWishlist.products_id.includes(id) ){
              // userWishlist.products_id.push(createWishlistDto.product_id);
              // const wishlists = await userWishlist.save();
              return userWishlist;
            }else{
              let filterdWishlists = await userWishlist.products_id.filter(item => item != id)
              userWishlist.products_id = filterdWishlists;

              const wishlists = await userWishlist.save();
              return wishlists
            }

        }else{
          return userWishlist;
        }

    } catch (error) {
      throw error;
    }

   
  }
  

  async isInWishlist(product_id: any) {

    let isInWishlist = await this._wishlist.find({products_id:product_id})
    if(isInWishlist.length> 0){
      return true;
    }else{
      return false;
    }

  }

  async toggle(createWishlistDto: CreateWishlistDto, user?: any) {

    try {
        let userWishlist = await this._wishlist.findOne({user:user.id})
        if(userWishlist){
          
        if(!userWishlist.products_id.includes(createWishlistDto.product_id)){
          userWishlist.products_id.push(createWishlistDto.product_id);
          const wishlists = await userWishlist.save();
          return wishlists;
        }else{
          let filterdWishlists = await userWishlist.products_id.filter(item => item != createWishlistDto.product_id)
          userWishlist.products_id = filterdWishlists;

          const wishlists = await userWishlist.save();
          return wishlists
        }

        }else{
          createWishlistDto.user = user.id
          createWishlistDto.products_id.push(createWishlistDto.product_id)
          return await this._wishlist.create(createWishlistDto)
        }
    } catch (error) {
      throw error;
    }
  


  }


}
