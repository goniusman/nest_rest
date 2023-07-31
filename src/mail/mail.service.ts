import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {


  constructor(private mailerService: MailerService) { }


  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    try {
      const statuss = await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './confirmation', // `.hbs` extension is appended automatically
        context: { // filling curly brackets with content
          name: user.name, 
          url,
        },
      });
      console.log(statuss);
    } catch (error) {

      console.log(error.message);
      console.log('sending mail....')

      throw new HttpException("Mail Sending Failed", HttpStatus.CONFLICT);


    }

  }


  async sendUserGreetings(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with c  ontent
        name: user.name,
        url,
      },
    });
    console.log('sending mainl')
  }



}
