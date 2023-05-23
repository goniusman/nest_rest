import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController, TopAuthors } from './authors.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {AuthorSchema} from './entities/author.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Author', schema: AuthorSchema}
    ])
  ],
  controllers: [AuthorsController, TopAuthors],
  providers: [AuthorsService],
})
export class AuthorsModule {}
