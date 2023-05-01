
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ICategory } from './interface/category.interface'
import Fuse from 'fuse.js';
import categoriesJson from '@db/categories.json';
import { paginate } from 'src/common/pagination/paginate';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import { CommonService } from 'src/common/common.service';
import {CommonHelper} from 'src/helper/commonHelper';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

import { Stats } from 'fs';
import { catchError } from 'rxjs';
// const categories = plainToClass(Category, categoriesJson);
// const options = {
//   keys: ['name', 'type.slug'],
//   threshold: 0.3,
// };
// const fuse = new Fuse(categories, options);

@Injectable()
export class CategoriesService {
  @Inject(CommonService)
  // private categories: Category[] = categories;

  private readonly _commonHelper = new CommonHelper()
  //  @Inject(CommonHelper) private readonly commonHelper: CommonHelper

    constructor(
      @InjectModel('Category') private _cat: Model<ICategory>,   
      private readonly commonService: CommonService,
      private cloudinary: CloudinaryService
    ) {}


    async uploadImageToCloudinary(file: Express.Multer.File) {
      return await this.cloudinary.uploadImage(file).catch((err) => {
        throw new BadRequestException(err.message);
      });
    }
  

   async create( createCategoryDto: CreateCategoryDto, file:any ) : Promise<any>{

      let status : boolean  = false;
      let message  = ""
      let data: any = null;
      let categoryModel: any = null;
      try {

        // const uploadedFile = await this.uploadImageToCloudinary(file)
        
        const existCat = this._cat.find(cat => cat.name === createCategoryDto.name).exec()

        const ca = existCat;

        if (!existCat) {
          categoryModel = await new this._cat(createCategoryDto);
          categoryModel.save()

        // console.log(categoryModel);
      
          if(categoryModel?._id){
              
            // const path = uploadedFile?.url || null;
            // const filename = uploadedFile?.original_filename || null;
            // const originalname = uploadedFile?.secure_url || null;

            // const attachmeResponse = await this.commonService.postAttachment({
            //   item_id: categoryModel?._id, 
            //   image_dir: path,
            //   thumbnail: filename,
            //   original: originalname
            // })

            // if(attachmeResponse.message == "failed"){
            //   throw new Error(`Attachment not saved successfully!`)
            // }

          }

          // const attachs = await this.commonService.getAttachments()
          status = true;
          message = "Successfully Created category" 
          data = categoryModel
          // console.log(categoryModel);
          return this.respone(status, message, data);
        }
        
    
      } catch (err) {

          // console.log(err);
          this.findanddelete(categoryModel?._id);
          status = false;
          message = err.message;
          data = err;
          return this.respone(status, message, data);

      }

    // return this._commonHelper.respone(status, message, data);

   } 

  respone (status: boolean, message: string, data: any = {} ): object {
    return {
      status: status,
      message: message,
      data: data
    }
  }



  async testCreate(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch((err) => {
      throw new BadRequestException(err);
    });
  }


  async findAll(): Promise<ICategory[]> {
    return this._cat.find().exec();
  }

  async findSubCategories(param): Promise<ICategory[]> {
    return this._cat.find({parent: param}).exec();
  }

  findanddelete(id: string):any {
    return this._cat.findByIdAndDelete(id).exec()
  }


  // getCategories({ limit, page, search, parent }: GetCategoriesDto) {
  //   if (!page) page = 1;
  //   const startIndex = (page - 1) * limit;
  //   const endIndex = page * limit;
  //   let data: Category[] = this.categories;
  //   if (search) {
  //     const parseSearchParams = search.split(';');
  //     for (const searchParam of parseSearchParams) {
  //       const [key, value] = searchParam.split(':');
  //       // data = data.filter((item) => item[key] === value);
  //       data = fuse.search(value)?.map(({ item }) => item);
  //     }
  //   }
  //   // if (parent === 'null') {
  //   //   data = data.filter((item) => item.parent === null);
  //   // }
  //   // if (text?.replace(/%/g, '')) {
  //   //   data = fuse.search(text)?.map(({ item }) => item);
  //   // }
  //   // if (hasType) {
  //   //   data = fuse.search(hasType)?.map(({ item }) => item);
  //   // }

  //   const results = data.slice(startIndex, endIndex);
  //   const url = `/categories?search=${search}&limit=${limit}&parent=${parent}`;
  //   return {
  //     data: results,
  //     ...paginate(data.length, page, limit, results.length, url),
  //   };
  // }


  
  


  // getCategory(param: string, language: string): Category {
  //   return this.categories.find(
  //     (p) => p.id === Number(param) || p.slug === param,
  //   );
  // }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return this.categories[0];
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }




}
