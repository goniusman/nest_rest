import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import {HasRoles} from 'src/auth/gurd/has-roles.decorator';
import {JwtAuthGuard} from 'src/auth/gurd/jwt-auth.guard';
import {Role} from 'src/auth/gurd/role.enum';
import {RolesGuard} from 'src/auth/gurd/roles.guard';
import {CreateProductDto} from './dto/create-product.dto';
import {GetPopularProductsDto} from './dto/get-popular-products.dto';
import {GetProductsDto,ProductPaginator} from './dto/get-products.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {Product} from './entities/product.entity';
import {ProductsService} from './products.service';

@Controller('products')
// @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.STAFF)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {

  private readonly logger = new Logger()
  
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createProduct(@Req() req: any, @Body() createProductDto: CreateProductDto) {
    try {

      const existProduct = await this.productsService.getProductBySlug(createProductDto.slug)
      if (!existProduct) {

        return this.productsService.create(createProductDto, req.user);

      } else {
        throw new HttpException('User Already Exists', HttpStatus.BAD_REQUEST)

      }

    } catch (error) {

      this.logger.error(`productController/create error is + ${error.message}`)
      throw error;

    }
  }

  @Get()
  async getProducts(@Query() query: GetProductsDto, @Req() req:any): Promise<ProductPaginator> {
    try {
      return this.productsService.getProducts(query);
    } catch (error) {
      this.logger.error(`productController/getProducts error is + ${error.message}`)
      throw error;
    }
  }

  @Get(':slug')
  async getProductBySlug(@Param('slug') slug: string): Promise<Product> {
    try {
      
      return this.productsService.getProductBySlug(slug);
    } catch (error) {
      this.logger.error(`productController/getProductBySlug error is + ${error.message}`)
      throw error;
    }
  }

  @Put(':id')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      if(id){

        return this.productsService.update(id, updateProductDto);
      }else{
        throw new HttpException('Product Id Not Found', HttpStatus.BAD_REQUEST)

      }
      
    } catch (error) {
      this.logger.error(`productController/update error is + ${error.message}`)
      throw error;
    }
  }

  @Delete(':id')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    try {
      if(id){

        return this.productsService.remove(id);
      }else{
        throw new HttpException('Product Id Not Found', HttpStatus.BAD_REQUEST)

      }
      
    } catch (error) {
      this.logger.error(`productController/remove error is + ${error.message}`)
      throw error;
    }
  }
}

@Controller('popular-products')
export class PopularProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  async getProducts(@Query() query: GetPopularProductsDto): Promise<Product[]> {
    return this.productsService.getPopularProducts(query);
  }
}
