
import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
// import * as bcrypt from '@types/bcrypt'; 
import * as bcrypt from 'bcrypt';  
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import {
  AuthResponse,
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  CoreResponse,
  RegisterDto,
  ResetPasswordDto,
  VerifyForgetPasswordDto,
  SocialLoginDto,
  OtpLoginDto,
  OtpResponse,
  VerifyOtpDto,
  OtpDto,
} from './dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
// import { User } from 'src/users/entities/user.entity';
import { User } from 'src/users/schema/user.schema';
import usersJson from '@db/users.json';
import {CommonHelper} from 'src/helper/commonHelper';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
const users = plainToClass(User, usersJson);

@Injectable()
export class AuthService {
  private users: User[] = users;
  private readonly _commonHelper = new CommonHelper()

  constructor(
    @InjectModel('User') private _user: Model<User>, 
    private  usersService: UsersService,
     private jwtService: JwtService) { }
    


  async validateUser(id: string, password: string): Promise<any> {
    const user = await this.usersService.getUser( id );
    console.log(user);
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!user) {
        throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
        return user;
    }
    return null;
  }     
                
  async login(body: any) {
    const user = await this.usersService.findByEmail(body.email);
    if (user?.password !== body.password) {
      throw new UnauthorizedException();
    }
      const payload = { email: user.email, subid: user._id };
      return {
          token: await this.jwtService.signAsync(payload),
          permissions: ['super_admin', 'customer'],
      };
  }
  
  async token(user: any) {
      const payload = { username: user.name, sub: user._id };
      return {
          access_token: this.jwtService.sign(payload),
      };
  }
  
  async getAllUsr() {
      return this.usersService.getAllUsr()
  }

  async register(createUserInput: RegisterDto): Promise<any> {
    // console.log(createUserInput);


    let status : boolean  = true;
    let message  = "Already registered"
    let data: any = null;
    let userModel: any = null; 
    try {
      const existCat = await this._user.findOne({name:createUserInput.name}).exec();

      // console.log(typeof existCat);
      // console.log( existCat);

      if (!existCat?._id) {
        userModel = await new this._user(createUserInput);
        userModel.save()
        status = true;
        message = "Successfully Created User" 
        data = userModel
        console.log(userModel);


        const payload = { username: userModel.name, sub: userModel._id };
        return {
          token: this.jwtService.sign(payload),
          permissions: ['super_admin', 'customer'],
        };

        // return this._commonHelper.respone(status, message, data);
      }
    } catch (err) {
        this.findAndDelete(userModel?._id);
        status = false;
        message = err.message;
        data = err;
        return this._commonHelper.respone(status, message, data);
    }
 
  return this._commonHelper.respone(status, message, data);


    // const user: User = {
    //   id: uuidv4(),
    //   ...users[0],
    //   ...createUserInput,
    //   created_at: new Date(),
    //   updated_at: new Date(),
    // };
    // this.users.push(user);

    // return {
    //   token: 'jwt token',
    //   permissions: ['super_admin', 'customer'],
    // };



  }

  findAndDelete(id: string):any {
    return this._user.findByIdAndDelete(id).exec()
  }


  // async login(loginInput: LoginDto): Promise<AuthResponse> {
  //   console.log(loginInput);
  //   return {
  //     token: 'jwt token',
  //     permissions: ['super_admin', 'customer'],
  //   };
  // }
  async changePassword(
    changePasswordInput: ChangePasswordDto,
  ): Promise<CoreResponse> {
    console.log(changePasswordInput);

    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async forgetPassword(
    forgetPasswordInput: ForgetPasswordDto,
  ): Promise<CoreResponse> {
    console.log(forgetPasswordInput);

    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async verifyForgetPasswordToken(
    verifyForgetPasswordTokenInput: VerifyForgetPasswordDto,
  ): Promise<CoreResponse> {
    console.log(verifyForgetPasswordTokenInput);

    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async resetPassword(
    resetPasswordInput: ResetPasswordDto,
  ): Promise<CoreResponse> {
    console.log(resetPasswordInput);

    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async socialLogin(socialLoginDto: SocialLoginDto): Promise<AuthResponse> {
    console.log(socialLoginDto);
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
    };
  }
  async otpLogin(otpLoginDto: OtpLoginDto): Promise<AuthResponse> {
    console.log(otpLoginDto);
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
    };
  }
  async verifyOtpCode(verifyOtpInput: VerifyOtpDto): Promise<CoreResponse> {
    console.log(verifyOtpInput);
    return {
      message: 'success',
      success: true,
    };
  }
  async sendOtpCode(otpInput: OtpDto): Promise<OtpResponse> {
    console.log(otpInput);
    return {
      message: 'success',
      success: true,
      id: '1',
      provider: 'google',
      phone_number: '+919494949494',
      is_contact_exist: true,
    };
  }

  // async getUsers({ text, first, page }: GetUsersArgs): Promise<UserPaginator> {
  //   const startIndex = (page - 1) * first;
  //   const endIndex = page * first;
  //   let data: User[] = this.users;
  //   if (text?.replace(/%/g, '')) {
  //     data = fuse.search(text)?.map(({ item }) => item);
  //   }
  //   const results = data.slice(startIndex, endIndex);
  //   return {
  //     data: results,
  //     paginatorInfo: paginate(data.length, page, first, results.length),
  //   };
  // }
  // public getUser(getUserArgs: GetUserArgs): User {
  //   return this.users.find((user) => user.id === getUserArgs.id);
  // }

   me(): any {
    // const id: string = "this is test id"
    return  this.usersService.getUser("645edc9c9f206888102d1782");
  }

  // updateUser(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }
}
