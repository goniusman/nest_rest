import { Injectable } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { ApproveWithdrawDto } from './dto/approve-withdraw.dto';
import { Withdraw } from './entities/withdraw.entity';
import { GetWithdrawsDto, WithdrawPaginator } from './dto/get-withdraw.dto';
import { paginate } from 'src/common/pagination/paginate';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class WithdrawsService {
  private withdraws: Withdraw[] = [];

  constructor(@InjectModel('Withdraw') private _withdraw : Model<Withdraw>){}

  
  async create(createWithdrawDto: CreateWithdrawDto) {
    try {
      // const exist = await this._withdraw.findOne(createWithdrawDto.shop_id)

      // if(!exist){
        const createTag = await this._withdraw.create(createWithdrawDto);
      // }

        return {
          ...createWithdrawDto,
        };

    } catch (error) {
      console.log(error);
    }
  }

  async getWithdraws({
    limit,
    page,
    status,
    shop_id,
    search
  }: GetWithdrawsDto): Promise< WithdrawPaginator> {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Withdraw[] = await this._withdraw.find().populate('shop_id');
    // if (status) {
    //   data = fuse.search(status)?.map(({ item }) => item);
    // }

    if (search) {
      const shopSearch = search.split(':')[1]
      data = await this._withdraw.find({shop_id: shopSearch}).populate('shop_id');
    }
    const results = data.slice(startIndex, endIndex);
    const url = `/withdraws?limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async findOne(id: string) {
    return await this._withdraw.findById(id);
  }

  async update(id: string, updateWithdrawDto: ApproveWithdrawDto) {
    return await this._withdraw.findByIdAndUpdate(id, updateWithdrawDto);
  }

  remove(id: string) {
    return this._withdraw.findByIdAndDelete(id)
  }
}
