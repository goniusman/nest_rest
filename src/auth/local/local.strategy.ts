import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  private readonly logger = new Logger();

  constructor(private authService: AuthService) {
    super({
      usernameField: 'email'
    });
  }

  async validate(email: string): Promise<User> {

    try {
      const user = await this.authService.validateUser(email);
      if (!user) {
        throw new HttpException('Email Should Not Be Empty!', HttpStatus.NOT_FOUND)
      }
      return user;
    } catch (error) {

      this.logger.error(`auth/LocalStrategy error message is -- ${error.message}`);
      throw error
      
    }


  }
}