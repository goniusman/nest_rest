import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorPaginator, GetAuthorDto } from './dto/get-author.dto';
import { GetTopAuthorsDto } from './dto/get-top-authors.dto';
import { Author } from './entities/author.entity';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { TransformInterceptor } from 'src/helper/respones';
import {HasRoles} from 'src/auth/gurd/has-roles.decorator';
import {Role} from 'src/auth/gurd/role.enum';
import {JwtAuthGuard} from 'src/auth/gurd/jwt-auth.guard';
import {RolesGuard} from 'src/auth/gurd/roles.guard';

// @UseInterceptors(TransformInterceptor)
@Controller('authors')
@HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  createAuthor(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  async getAuthors(@Query() query: GetAuthorDto): Promise<AuthorPaginator> {
    return this.authorsService.getAuthors(query);
  }

  @Get(':slug')
  async getAuthorBySlug(@Param('slug') slug: string): Promise<Author> {
    return this.authorsService.getAuthorBySlug(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}

@Controller('top-authors')
export class TopAuthors {
  constructor(private authorsService: AuthorsService) {}

  @Get()
  getTopAuthors(@Query() query: GetTopAuthorsDto): Promise<Author[]> {
    return this.authorsService.getTopAuthors(query);
  }
}
