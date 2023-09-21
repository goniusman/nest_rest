
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { paginate } from 'src/common/pagination/paginate';
import { CommonHelper } from 'src/helper/commonHelper';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

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
      @InjectModel('Category') private _cat: Model<Category>
    ) {}


   async create( createCategoryDto: CreateCategoryDto ) : Promise<any>{

      let status : boolean  = false;
      let message  = ""
      let data: any = null;
      let categoryModel: any = null;
      try {

        const existCat = await this._cat.findOne({name:createCategoryDto.name}).exec()

        // const ca = existCat;

        if (!existCat) {
          categoryModel = await new this._cat(createCategoryDto);
          // categoryModel.slug = createCategoryDto.name;
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
          // status = true;
          // message = "Successfully Created category" 
          // data = categoryModel
          // // console.log(categoryModel);
          // return this.respone(status, message, data);
          return categoryModel;
        }
        
        return {
          message: "Already Created Category",
          status: false,
        }
    
      } catch (err) {

          // console.log(err);
          // this.findanddelete(categoryModel?._id);
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



  // async testCreate(file: Express.Multer.File) {
  //   return await this.cloudinary.uploadImage(file).catch((err) => {
  //     throw new BadRequestException(err);
  //   });
  // }


//  async findAll(): Promise<any[]> {
//     const cats = await this._cat.find().exec();
//     return cats
//   } 

  // async findSubCategories(param): Promise<Category[]> {
  //   return this._cat.find({parent: param}).exec();
  // }

  // findanddelete(id: string):any {
  //   return this._cat.findByIdAndDelete(id).exec()
  // }


  async getCategories({ limit, page, search, parent }: GetCategoriesDto) {
    if (!page) page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Category[] = await this._cat.find().populate('type');
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // data = data.filter((item) => item[key] === value);
        // data = data.find(value)?.map(({ item }) => item);
      }
    }
    if (parent === 'null') {
      data = data.filter((item) => item.parent === null);
    }
    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }
    // if (hasType) {
    //   data = fuse.search(hasType)?.map(({ item }) => item);
    // }

    const results = data.slice(startIndex, endIndex);
    const url = `/categories?search=${search}&limit=${limit}&parent=${parent}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, data.length, url),
    };
  }


  async getCategory(param: string, language: string): Promise< Category> {
    const category = (await this._cat.findById(param).exec()).populate('type');
    return category;
    //   (p) => p.id === Number(param) || p.slug === param,
    // );
  }

  async getCategoryBySlug(param: string): Promise< any> {
    const category = (await this._cat.findOne({slug: param}).exec()).populate('type');
    return category;
    //   (p) => p.id === Number(param) || p.slug === param,
    // );
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this._cat.findByIdAndUpdate(id, updateCategoryDto);
  }

  remove(id: string) {
    try {
      
      return this._cat.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error(error);
    }
  }




}
