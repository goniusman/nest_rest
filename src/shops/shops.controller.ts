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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/gurd/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/gurd/jwt-auth.guard';
import { Role } from 'src/auth/gurd/role.enum';
import { RolesGuard } from 'src/auth/gurd/roles.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserPaginator } from 'src/users/dto/get-users.dto';
import { CreateShopDto } from './dto/create-shop.dto';
import { GetShopsDto, ShopPaginator } from './dto/get-shops.dto';
import { GetStaffsDto } from './dto/get-staffs.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsService } from './shops.service';

@Controller('shops')
@ApiBearerAuth()
@ApiTags("Shops")  
// @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.STAFF)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ShopsController {

  private readonly logger = new Logger()

  constructor(private readonly shopsService: ShopsService) {
    
  }

  @Post()
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createShopDto: CreateShopDto, @Req() request) {
    try {
      const isAdminOrOwner = await this.shopsService.isAdminOrOwner(request.user.id)
      if(isAdminOrOwner) {
         const shopName = await this.shopsService.getShop(createShopDto.name)
        if(!shopName?._id) {
          const createShop = await this.shopsService.create(createShopDto);
          if(createShop._id){
            return createShop
          }else{
            return null
          }
         
        }else{

          throw new HttpException('Shop Name Already Exist!', HttpStatus.BAD_REQUEST)

        }
      }else{
        throw new HttpException('You are not allowed to create shop!', HttpStatus.BAD_REQUEST)

      }
     
      
    } catch (error) {
      this.logger.error(`ShopsController/create error is ${error.message}`)
      throw error;
    }
  }

  @Get()
  async getShops(@Query() query: GetShopsDto): Promise<ShopPaginator> {
    return this.shopsService.getShops(query);
  }

  @Get(':slug')
  async getShop(@Param('slug') slug: string) {
    return this.shopsService.getShop(slug);
  }

  @Put(':id')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(id, updateShopDto);
  }

  @Delete(':id')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    try {
      return this.shopsService.remove(id);
    } catch (error) {
      this.logger.error(`ShopsController/remove error is ${error.message}`)
      throw error;
    }
  }

  // @Post('approve')
  // approveShop(@Req() req, @Param('id') id: string) {
  //   return this.shopsService.approve(id);
  // }

  // @Post('disapprove')
  // disapproveShop(@Param('id') id: string) {
  //   return this.shopsService.approve(id);
  // }
}

@Controller('staffs')
export class StaffsController {
  private readonly logger = new Logger();

  constructor(private readonly shopsService: ShopsService) {}
  

  @Post()
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createStaff(@Req() req, @Body() createStaffDto: CreateUserDto) {

    try {
      const {email, password, shop_id} = createStaffDto;
      if(email && password && shop_id){

        const createdStaff = await this.shopsService.createStaff(createStaffDto)

        if(createdStaff._id){
          const shop = await this.shopsService.getShopById(createStaffDto.shop_id)
          if(shop._id){
            shop.staffs.push(createdStaff._id)
            const shopUpdate = await this.shopsService.update(shop._id.toString(), shop)
            if(shopUpdate._id){
              return createdStaff
            }else{
              throw new HttpException('Shop Not Update !', HttpStatus.BAD_REQUEST)
            }
          }else{
            throw new HttpException('Shop Not Found!', HttpStatus.NOT_FOUND)
          }
        }else{
          throw new HttpException('User Not Created!', HttpStatus.BAD_REQUEST)
        }
      }else{
        throw new HttpException('Field Not Empty!', HttpStatus.BAD_REQUEST)
      }

    } catch (error) {
      this.logger.error(`shops/createStaff failed: ${error} user is ${req.user.id}`)
      throw error
    }

  }

  @Get()
  async getStaffs(@Query() query: GetStaffsDto): Promise<UserPaginator> {
    return this.shopsService.getStaffs(query);
  }

  @Get(':slug')
  async getShop(@Param('slug') slug: string) {
    return this.shopsService.getShop(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(id, updateShopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(id);
  }
}

@Controller('disapprove-shop')
@HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.STAFF)
@UseGuards(JwtAuthGuard, RolesGuard)
export class DisapproveShopController {
  constructor(private shopsService: ShopsService) {}

  @Post()
  async disapproveShop(@Req() req , @Body('id') id) {
    return this.shopsService.disapproveShop(id);
  }
}

@Controller('approve-shop')
export class ApproveShopController {
  constructor(private shopsService: ShopsService) {}

  @Post()
  async approveShop(@Req() req, @Body() id) {
    return this.shopsService.approveShop(id);
  }
}
