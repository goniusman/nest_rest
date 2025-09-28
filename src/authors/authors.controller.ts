import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {HasRoles} from 'src/auth/gurd/has-roles.decorator';
import {JwtAuthGuard} from 'src/auth/gurd/jwt-auth.guard';
import {Role} from 'src/auth/gurd/role.enum';
import {RolesGuard} from 'src/auth/gurd/roles.guard';
import {AuthorsService} from './authors.service';
import {CreateAuthorDto} from './dto/create-author.dto';
import {AuthorPaginator,GetAuthorDto} from './dto/get-author.dto';
import {GetTopAuthorsDto} from './dto/get-top-authors.dto';
import {UpdateAuthorDto} from './dto/update-author.dto';
import {Author} from './entities/author.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Authors")
// @UseInterceptors(TransformInterceptor)
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  

  @Delete(':id')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
