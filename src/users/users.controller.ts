import {
  Controller,
  Request,
  UseGuards,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
  // CACHE_MANAGER, 
  Inject
} from '@nestjs/common';

import {
CacheInterceptor,
CacheTTL,
CacheKey
} from  '@nestjs/cache-manager'
import Cache from 'cache-manager';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { CreateProfileDto } from './dto/create-profile.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUsersDto } from './dto/get-users.dto';
import {ApiConsumes, ApiOkResponse} from '@nestjs/swagger';
// import { CreateUserDto } from '../dto/create-user.dto';
import {  User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
// import { LocalAuthGuard } from '../auth/local/local.auth.guard';
// import { AuthenticatedGuard } from '../auth/local/authenticated.guard';
import {FileInterceptor} from '@nestjs/platform-express';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { HasRoles } from 'src/auth/gurd/has-roles.decorator';
import { Role } from 'src/auth/gurd/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/gurd/roles.guard';
import { JwtAuthGuard } from 'src/auth/gurd/jwt-auth.guard';
// import { IUser } from '../interface/user.interface';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger();
  randomNumDbs = Math.floor(Math.random() * 10)
  constructor(
    // private readonly logger : Logger,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly usersService: UsersService) {}
  // @ApiOkResponse({
  //   description: 'The user records',
  //   type: User,
  //   isArray: true
  // })

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
  

  
  // @Post()
  // @ApiConsumes('multipart/form-data')
  // createUser(@Body() createUserDto: CreateUserDto): Promise<UserDocument>  {
  //   return this.usersService.create(createUserDto);
  // }

  // @UseGuards(LocalAuthGuard)
  // @Post("/login")
  // login(@Body() req): any {
  //   console.log(req);
  //   return {User: req.user,
  //           msg: 'User logged in'};
  // }


  // @Get('/logout')
  // logout(@Request() req): any {
  //   req.session.destroy();
  //   return { msg: 'The user session has ended' }
  // }
 

  // @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
  // @CacheKey('custom-key') // overrides the default cache key
  // @CacheTTL(30) // override TTL to 30 seconds
  @Get()
  // @HasRoles(Role.CUSTOMER, Role.STORE_OWNER)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // getAllUsers(@Query() query: any) {
  //   // console.log('requesting.....');
  //   // this.logger.error("this is error message")
  //   // return HttpStatus.UNAUTHORIZED
  //   return this.usersService.getUsers(query);   
  // }

  // @UseGuards(AuthenticatedGuard)
  @Get(':id')
  getUser(@Param('id') id: string) {
    //nice to meet you
    return this.usersService.findById(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
 
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Post('unblock-user')
  activeUser(@Body('id') id: string) {
    return this.usersService.activeUser(id);
  }

  @Post('block-user')
  banUser(@Body('id') id: string) {
    return this.usersService.banUser(id);
  }

  @Post('make-admin') 
  makeAdmin(@Req() req: Request , @Body('user_id') id: string) {
    //// testing for docker save directly
    return this.usersService.makeAdmin(id);
  }

  // @Post('profile-picture')
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('file'))
  // profilePicture(@UploadedFile() file: Express.Multer.File):any {
  // //  console.log(file);
  //     return this.usersService.profilePicture(file);
  // }

  //// end controller methods


}





@Controller('profiles')
export class ProfilesController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    console.log(createProfileDto);
  }

  @Put(':id')
  updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    console.log(updateProfileDto);
  }

  // @Delete(':id')
  // deleteProfile(@Param('id') id: number) {
  //   return this.usersService.remove(id);
  // }

  /////// nice docker save using volume
}
