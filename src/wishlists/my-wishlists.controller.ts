import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {HasRoles} from 'src/auth/gurd/has-roles.decorator';
import {JwtAuthGuard} from 'src/auth/gurd/jwt-auth.guard';
import {Role} from 'src/auth/gurd/role.enum';
import {RolesGuard} from 'src/auth/gurd/roles.guard';
import {CreateWishlistDto} from './dto/create-wishlists.dto';
import {GetWishlistDto} from './dto/get-wishlists.dto';
import {UpdateWishlistDto} from './dto/update-wishlists.dto';
import {MyWishlistService} from './my-wishlists.service';
@Controller('my-wishlists')
@HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
@UseGuards(JwtAuthGuard, RolesGuard)
export class MyWishlistsController {

  private readonly logger = new Logger();
  
  constructor(private myWishlistService: MyWishlistService) {}

  // create
  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto) {
    try {
      
      return this.myWishlistService.create(createWishlistDto);
    // }else{
    //   throw new HttpException('ID Should not be emapty', HttpStatus.BAD_REQUEST)
  
    // }

    } catch (error) {
      this.logger.error(`my-wishlists/create failed: ${error} user is ${createWishlistDto?.user}`)
      throw error
    }
  }

  // Get All
  @Get()
  findAll(@Query() query: GetWishlistDto) {
    try {
      
      return this.myWishlistService.findAMyWishlists(query);
    } catch (error) {
      this.logger.error(`my-wishlists/findAll failed: ${error}`)
      throw error
    }
  }
  // Get single
  @Get(':id')
  find(@Param('id') id: any) {
    try {
      
      return this.myWishlistService.findAMyWishlist(id);
    } catch (error) {
      this.logger.error(`my-wishlists/find failed: ${error}`)
      throw error
    }

  }

  // update
  @Put(':id')
  update(
    @Param('id') id: any,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    try {
      
      return this.myWishlistService.update(id, updateWishlistDto);
    } catch (error) {
      this.logger.error(`my-wishlists/update failed: ${error}`)
      throw error
    }

  }

  // delete
  @Delete(':id')
  delete(@Param('id') id: any) {
    try {
      
      return this.myWishlistService.delete(id);
    } catch (error) {
      this.logger.error(`my-wishlists/delete failed: ${error}`)
      throw error
    }


  }
}
