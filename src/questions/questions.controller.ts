import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {CreateQuestionDto} from './dto/create-question.dto';
import {GetQuestionDto} from './dto/get-questions.dto';
import {UpdateQuestionDto} from './dto/update-question.dto';
import {QuestionService} from './questions.service';
import { HasRoles } from 'src/auth/gurd/has-roles.decorator';
import { Role } from 'src/auth/gurd/role.enum';
import { JwtAuthGuard } from 'src/auth/gurd/jwt-auth.guard';
import { RolesGuard } from 'src/auth/gurd/roles.guard';

@Controller('questions')
export class QuestionController {

  private readonly logger = new Logger();
  
  constructor(private questionService: QuestionService) {}
  // show all
  // TODO: there is a bug in displaying all questions
  // In product single page front-end all the questions apperaed. It should be based on product ID.
  @Get()
  findAll(@Query() query: GetQuestionDto) {
    return this.questionService.findAllQuestions(query);
  }
  // show one
  @Get(':id')
  find(@Param('id') id: string) {
    return this.questionService.findQuestion(id);
  }
  // create
  @Post()
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createQuestionDto: CreateQuestionDto, @Req() req: any) {
    try {
      
      return this.questionService.create(createQuestionDto, req.user);
    } catch (error) {
      this.logger.error(`questions/create failed: ${error}`)
      throw error
    }
  }

  // update
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, updateQuestionDto);
  }

  // delete
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.questionService.delete(id);
  }
}
