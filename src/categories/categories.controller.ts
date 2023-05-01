import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  // NestMiddleware,
  Inject
} from '@nestjs/common';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
// import { FilesInterceptor } from '@nestjs/platform-express';


import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {ApiConsumes,ApiBody} from '@nestjs/swagger';
import {diskStorage} from 'multer';
import { Category } from './entities/category.entity';
import { ICategory } from './interface/category.interface';
// import { CloudinaryMiddleware } from 'src/providers/CloudinaryMiddleware';




@Controller('categories')
export class CategoriesController {

  constructor(
    private readonly categoriesService: CategoriesService, 
    // @Inject(CloudinaryMiddleware) private cloudinaryMiddleware: CloudinaryMiddleware
    ) {}



  @Post()
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('file', {storage: diskStorage(
  //   {
  //     destination: './images/',
  //     filename: (req, file, cb) => {
  //       const fileNameSplit = file.originalname.split('.');
  //       const oriImageName = fileNameSplit[0]
  //       const fileExt = fileNameSplit[fileNameSplit.length - 1];
  //       cb(null, `${Date.now()}_${oriImageName}.${fileExt}`)
  //     }

  //   }
  // )}))
  // @NestMiddleware(this.cloudinaryMiddleware.getMiddleware())
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File
   ): any {
    // console.log(file);
    // console.log(createCategoryDto);

    ///// for cloudinary images
    // const imagePath = file.path;
    // const result = await this.cloudinaryMiddleware.getMiddleware()(imagePath);
    // console.log(result); 

    return this.categoriesService.create(createCategoryDto, file); 

  }


  @Post('testFileUploadToCloudinary')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  testFileUploadToCloudinary(@UploadedFile() file: Express.Multer.File):any {
  //  console.log(file);
      return this.categoriesService.testCreate(file);
  }



  @Get()
  findAll(): Promise<ICategory[]> { 
    return this.categoriesService.findAll();
  }



  @Get(':subcategories')
  findSubCategories(@Param('param') param: string): Promise<ICategory[]> { 
    return this.categoriesService.findSubCategories(param);
  }




  // @Get(':param')
  // findOne(@Param('param') param: string, @Query('language') language: string) {
  //   return this.categoriesService.getCategory(param, language);
  // }

  // @Put(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   return this.categoriesService.update(+id, updateCategoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoriesService.remove(+id);
  // }
}


