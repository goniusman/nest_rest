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

import {UsersService} from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
// import { CreateProfileDto } from './dto/create-profile.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { CreateUserDto } from '../dto/create-user.dto';
// import { LocalAuthGuard } from '../auth/local/local.auth.guard';
// import { AuthenticatedGuard } from '../auth/local/authenticated.guard';
import {HasRoles} from 'src/auth/gurd/has-roles.decorator';
import {JwtAuthGuard} from 'src/auth/gurd/jwt-auth.guard';
import {Role} from 'src/auth/gurd/role.enum';
import {RolesGuard} from 'src/auth/gurd/roles.guard';
import {CreateProfileDto} from './dto/create-profile.dto';
import {UpdateProfileDto} from './dto/update-profile.dto';
// import { IUser } from '../interface/user.interface';

@Controller('users')
// @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {

  private readonly logger = new Logger();
  randomNumDbs = Math.floor(Math.random() * 10)

  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly usersService: UsersService) { }


  @Get()
  getAllUsers(@Req() req, @Query() query: any) {
    try {
    
      return this.usersService.getUsers(query);

    } catch (error) {
      this.logger.error(`users/getAllUsers failed: ${error} user is ${req.user.id}`)
      throw error
    }
  }


  @Get(':id')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUser(@Param('id') id: string) {
    //nice to meet you
    return this.usersService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }


  @Post('update-email')
  @HasRoles(Role.STORE_OWNER, Role.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  updateEmail( @Body() updateUserDto: UpdateUserDto, @Req() req:any) {
    try {
      return this.usersService.updateEmail( updateUserDto, req.user);
      // throw new HttpException('No user found', HttpStatus.NOT_FOUND)
    } catch (error) {
      this.logger.error(`users/updateEmail failed: ${error} user is ${req.user.id}`)
      throw error
    }
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeUser(@Param('id') id: any) {
    return await this.usersService.remove(id);
  }


  @Post('unblock-user')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  activeUser(@Req() req, @Body('id') id: string) {
  
    try {
      if(id){
      const user = this.usersService.findById(id)
      if(user){
        return this.usersService.activeUser(id);

      }else{
        throw new HttpException('No user found', HttpStatus.NOT_FOUND)
      }
      }else{
        throw new HttpException('ID Should not be emapty', HttpStatus.BAD_REQUEST)
    
      }

    } catch (error) {
      this.logger.error(`users/activeUser failed: ${error} user is ${req.user.id}`)
      throw error
    }
  }


  @Post('block-user')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  banUser(@Req() req,@Body('id') id: string) {
    try {

      if(id){

      const user = this.usersService.findById(id)
      if(user){
        return this.usersService.banUser(id);

      }else{
        throw new HttpException('No user found', HttpStatus.NOT_FOUND)
      }
    
    }else{
      throw new HttpException('ID Should not be emapty', HttpStatus.BAD_REQUEST)
    
    }
    } catch (error) {
      this.logger.error(`users/banUser failed: ${error} user is ${req.user.id}`)
      throw error
    }

  
  }

  @Post('make-admin')
  @HasRoles(Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async assignORRevoke(@Req() req, @Body('user_id') id: string) {
    
    try {
      if(id){
      const user = await this.usersService.findById(id)
      if(user){
        const updatedUser = await this.usersService.assignORRevoke(id, user);
        return updatedUser

      }else{
        throw new HttpException('No user found', HttpStatus.NOT_FOUND)
      }
      }else{
        throw new HttpException('ID Should not be emapty', HttpStatus.BAD_REQUEST)
    
      }

    } catch (error) {
      this.logger.error(`users/assignORRevoke failed: ${error} user is ${req.user.id}`)
      throw error
    }

  }

  @Delete('remove-address/:id')
  @HasRoles(Role.SUPER_ADMIN, Role.CUSTOMER, Role.STORE_OWNER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  removeAddress(@Param('id') id: any, @Req() req : any){
    try {
      if(id){
        return this.usersService.removeAddress(id, req?.user)
      }else{
        throw new HttpException('ID Should not be emapty', HttpStatus.BAD_REQUEST)
      }
    } catch (error) {
      this.logger.error(`users/remove-address failed: ${error} user is ${req.user.id}`)
      throw error
    }
  }

  @Post('add-points')
  @HasRoles(Role.SUPER_ADMIN, Role.CUSTOMER, Role.STORE_OWNER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addWalletPoints(@Body() addPointsDto: any) {
    // return this.authService.me();
  }


  // @Post('profile-picture')
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('file'))
  // profilePicture(@UploadedFile() file: Express.Multer.File):any {
  // //  console.log(file);
  //     return this.usersService.profilePicture(file);
  // }

  //// end controller methods

  // @Post('contact-us')
  // contactUs(@Body() addPointsDto: any) {
  //   return {
  //     success: true,
  //     message: 'Thank you for contacting us. We will get back to you soon.',
  //   };

  // }




  ///////////////// previously created for cache
  // async getNumber(): Promise<any> {
  //   const val = await this.cacheManager.get('number')
  //   if(val) {
  //     return { 
  //       data: val,
  //       FromRedis: 'this is loaded from redis cache'
  //     }
  //   }

  //   if(!val){
  //     await this.cacheManager.set('number', this.randomNumDbs , { ttl: 1000 })
  //     return {
  //       data: this.randomNumDbs,
  //       FromRandomNumDbs: 'this is loaded from randomNumDbs'
  //   }
  //   }

  // }


  // @Get("getSomeDate")
  // async getSomeDate(): Promise<any> {
  //   return await this.usersService.getSomeDate()
  // } 


  // @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
  // @CacheKey('custom-key') // overrides the default cache key
  // @CacheTTL(30) // override TTL to 30 seconds







}


@Controller('profiles')
export class ProfilesController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    console.log(createProfileDto);
  }

  @Put(':id')
  updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    console.log(updateProfileDto);
  }

  @Delete(':id')
  deleteProfile(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

 
}




