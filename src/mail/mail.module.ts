import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import env from '../config/env'

const { host, port, user, password, from, transport } = env().mailer

@Global() // 👈 global module
@Module({
  imports: [
    MailerModule.forRoot({
      // transport: transport,
      // or
      transport: {
        host: host,
        port: Number(port),
        auth: {
          user: user,
          pass: password,
        },
      },
      defaults: {
        from: from,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule { }
