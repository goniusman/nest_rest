
import { HttpStatus, Injectable, NotAcceptableException, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
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
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {JwtAuthGuard} from './gurd/jwt-auth.guard';
const users = plainToClass(User, usersJson);

@Injectable()
export class AuthService {
  private users: User[] = users;
  private readonly _commonHelper = new CommonHelper()

  constructor(
    // @InjectModel('User') private _user: Model<User>, 
    private  usersService: UsersService,
     private jwtService: JwtService) { }
    

  async register(createUserInput: CreateUserDto): Promise<any> {
  // console.log(createUserInput);


  let status : boolean  = true;
  let message  = "Already registered"
  let data: any = null;
  let user: any = null; 
  try {
    const existCat = await this.usersService.findByEmail(createUserInput.email);

    // console.log(typeof existCat);
    // console.log( existCat);

    if (!existCat?._id) {
      user = await this.usersService.create(createUserInput);
      // await userModel.save()
      status = true;
      message = "Successfully Created User" 
      data = user
      console.log(user);

      const id = user?._id.toString()
      const permission = user?.permissions
      const payload = { email: user.email, subid: id, permissions: permission,
        name: user.name };
      return {
        token: this.jwtService.sign(payload),
        permissions: permission,
        id: id,
      };

      // return this._commonHelper.respone(status, message, data);
    }
  } catch (err) {
      // this.findAndDelete(userModel?._id);
      // status = false;
      // message = err.message;
      // data = err;
      // return this._commonHelper.respone(status, message, data);
      return {
        message: err.message,
        status: HttpStatus.BAD_REQUEST
      }
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

  async validatePassword(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    // console.log(user); 
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password)
    return passwordValid;
    // if (user && passwordValid) {
    //     return user;
    // }
    // return null;
  } 

  async validateUser(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
  
    if (!user) {
        return false;
    }else{
      return true;
    }

  }     
                
  async login(body: any): Promise<any> {

    try {
       const user = await this.usersService.findByEmail(body.email);
       const ValidePassword = await this.validatePassword(user?.email , body.password);
        if (!ValidePassword) {
              throw new UnauthorizedException();
          } else{
            const id = user?._id.toString();
            const permissions = user?.permissions
            const payload = { email: user.email, subid: id, permissions: permissions,name: user.name};
            return {
                token: await this.jwtService.signAsync(payload),
                permissions: permissions,
                id: id
            };
          }
       
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
   
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

  

  findAndDelete(id: string):any {
    return this.usersService.remove(id)
  }


  // async login(loginInput: LoginDto): Promise<AuthResponse> {
  //   console.log(loginInput);
  //   return {
  //     token: 'jwt token',
  //     permissions: ['super_admin', 'customer'],
  //   };
  // }

  async changePassword(email:string, 
    changePasswordInput: ChangePasswordDto,
  ): Promise<CoreResponse> {

    try {
        const validateUser = await this.validateUser(email);
      if (!validateUser) {
        throw new Error("User Not Found")
      }
      const validatePassword = await this.validatePassword(email, changePasswordInput.oldPassword)
      
      if(!validatePassword){
        throw new Error("Password did not match")
      }

      const updatePassword = await this.usersService.updatePassword(email, changePasswordInput.newPassword)

      if(!updatePassword){
        throw new Error("Password not Changed")
      }else{
          return {
            success: true,
            message: 'Password change successful',
          };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: 403
      };
    }
   

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
      id: ""
    };
  }
  async otpLogin(otpLoginDto: OtpLoginDto): Promise<AuthResponse> {
    console.log(otpLoginDto);
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
      id: ""
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

  async me(id:string = "645edc9c9f206888102d1782"):  Promise<any>  {
    // const id: string = "this is test id"

    const user = await this.usersService.getUser(id);
    // const {password, ...result} = user._doc
    return user
  }

  // updateUser(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }
}
