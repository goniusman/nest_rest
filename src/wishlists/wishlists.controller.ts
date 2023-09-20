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
  UseGuards,
} from '@nestjs/common';
import {HasRoles} from 'src/auth/gurd/has-roles.decorator';
import {JwtAuthGuard} from 'src/auth/gurd/jwt-auth.guard';
import {Role} from 'src/auth/gurd/role.enum';
import {RolesGuard} from 'src/auth/gurd/roles.guard';
import {CreateWishlistDto} from './dto/create-wishlists.dto';
import {GetWishlistDto} from './dto/get-wishlists.dto';
import {UpdateWishlistDto} from './dto/update-wishlists.dto';
import {WishlistsService} from './wishlists.service';
@Controller('wishlists')
@HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
@UseGuards(JwtAuthGuard, RolesGuard)
export class WishlistsController {
  
  private readonly logger = new Logger();

  constructor(private wishlistService: WishlistsService) {}

  // create
  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto) {
    try {
      
      return this.wishlistService.create(createWishlistDto);
    // }else{
    //   throw new HttpException('ID Should not be emapty', HttpStatus.BAD_REQUEST)
  
    // }

    } catch (error) {
      this.logger.error(`wishlists/create failed: ${error} user is ${createWishlistDto?.user}`)
      throw error
    }
  }

  // Get All
  @Get()
  findAll(@Query() query: GetWishlistDto) {
    try {
      
      return this.wishlistService.findAMyWishlists(query);
    } catch (error) {
      this.logger.error(`wishlists/findAll failed: ${error}`)
      throw error
    }
  }

  // Get single
  @Get(':id')
  find(@Param('id') id: any) {
    try {
      
      return this.wishlistService.findAMyWishlist(id);
    } catch (error) {
      this.logger.error(`wishlists/find failed: ${error}`)
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
      
      return this.wishlistService.update(id, updateWishlistDto);
    } catch (error) {
      this.logger.error(`wishlists/update failed: ${error}`)
      throw error
    }

  }

  // delete
  @Delete(':id')
  delete(@Param('id') id: any) {
    try {
      
      return this.wishlistService.delete(id);
    } catch (error) {
      this.logger.error(`wishlists/delete failed: ${error}`)
      throw error
    }

  }

  // wishlists/toggle
  @Post('/toggle')
  toggle(@Body() CreateWishlistDto: CreateWishlistDto) {
    try {
     return this.wishlistService.toggle(CreateWishlistDto);
    } catch (error) {
      this.logger.error(`wishlists/toggle failed: ${error}`)
      throw error
    }

  }

  // /in_wishlist/{product_id}
  @Get('/in_wishlist/:product_id')
  inWishlist(@Param('product_id') id: any) {
    try {
      return this.wishlistService.isInWishlist(id);
    } catch (error) {
      this.logger.error(`wishlists/in_wishlist/:product_id failed: ${error}`)
      throw error
    }

    
  }
}
