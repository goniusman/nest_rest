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

  async findAMyWishlists({ limit, page, search }: GetWishlistDto, user = null) {
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

  async delete(id: any, customer: any) {
    
    var ObjectId = require('mongoose').Types.ObjectId; 
    var query = { user: new ObjectId(customer.id) };


      try {
        let customerId = customer?.id;
        let userWishlist = await this._wishlist.findOne({user: customer.id})
        if(userWishlist){
          
            if(!userWishlist.products_id.includes(id) ){
              console.log(id)
              // userWishlist.products_id.push(createWishlistDto.product_id);
              // const wishlists = await userWishlist.save();
              return userWishlist;
            }else{
              let filterdWishlists = await userWishlist.products_id.filter(item => item !== id)
              userWishlist.products_id = filterdWishlists;
              console.log(filterdWishlists)
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
  

  async isInWishlist(product_id: any, user: any) {

    let wishlists = await this._wishlist.findOne({customer: user?.id})
    
    if(wishlists?.products_id.includes(product_id)){
      return true;
    }else{
      return false;
    }

    // let isInWishlist = await this._wishlist.find({products_id:product_id})
    // if(isInWishlist.length> 0){
    //   return true;
    // }else{
    //   return false;
    // }

  } 
  
  async toggle(createWishlistDto: CreateWishlistDto, user?: any) {

    try {
        let userWishlist = await this._wishlist.findOne({customer:user?.id})
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
          let Whislist: Wishlist = new Wishlist();
          Whislist.products_id =  [createWishlistDto.product_id]
          let customerId = user?.id;
          Whislist.customer = customerId;
          // createWishlistDto.user = customer.id
          // createWishlistDto.products_id = [createWishlistDto.product_id]
          // const {product_id, ...wish} = createWishlistDto;
          return await this._wishlist.create(Whislist)
        }

    } catch (error) {
      throw error;
    }
  


  }


}
