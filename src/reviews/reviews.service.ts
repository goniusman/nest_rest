import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Fuse from 'fuse.js';
import { Model } from 'mongoose';
import { paginate } from 'src/common/pagination/paginate';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsDto } from './dto/get-reviews.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

// const reviews = plainToClass(Review, reviewJSON);
const options = {
  keys: ['product'],
  threshold: 0.3,
};


@Injectable()
export class ReviewService {
  // private reviews: Review[] = reviews;

  constructor(
    @InjectModel('Review') private _reviews: Model<Review>
  ) {}
  

  async findAllReviews({ limit, page, search, product_id }: GetReviewsDto) {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data = await this._reviews.find().populate('customer product order shop');
    const fuse = new Fuse(data, options);
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    if (product_id) {
      // data = fuse.search({product:product_id})?.map(({ item }) => item);
       data = await this._reviews.find({product: product_id}).populate('customer product shop');
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/reviews?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async findReview(id: any, user: any) {
    return await this._reviews.findOne({product: id, customer: user.id});
  }

  create(createReviewDto: CreateReviewDto) {
    return this._reviews.create(createReviewDto);
  }

  update(id: any, updateReviewDto: UpdateReviewDto) {
    return this._reviews.findByIdAndUpdate(id, updateReviewDto);
  }

  delete(id: any) {
    return this._reviews.findByIdAndDelete(id);
  }
}
