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
  UseGuards,
} from '@nestjs/common';
import {HasRoles} from 'src/auth/gurd/has-roles.decorator';
import {JwtAuthGuard} from 'src/auth/gurd/jwt-auth.guard';
import {Role} from 'src/auth/gurd/role.enum';
import {RolesGuard} from 'src/auth/gurd/roles.guard';
import {CreateReviewDto} from './dto/create-review.dto';
import {GetReviewsDto} from './dto/get-reviews.dto';
import {UpdateReviewDto} from './dto/update-review.dto';
import {ReviewService} from './reviews.service';

@Controller('reviews')
@HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewController {

    
  private readonly logger = new Logger();
  
  constructor(private readonly reviewService: ReviewService) {}


  //  create a new review
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    try {

    return this.reviewService.create(createReviewDto);
     } catch (error) {
       this.logger.error(`shippings/findAll failed: ${error}`)
       throw error
     }

  }

  //   find all reviews
  // TODO: there is a bug in displaying all reviews
  // front-end a issue ase with pobon paul
  // In product single page front-end all the reviews apperaed. It should be based on product ID.
  @Get()
  async findAll(@Query() query: GetReviewsDto) {

    try {

    return this.reviewService.findAllReviews(query);
     } catch (error) {
       this.logger.error(`shippings/findAll failed: ${error}`)
       throw error
     }
  }

  //   find one review by ID
  @Get(':id')
  find(@Param('id') id: string) {
    try {

    return this.reviewService.findReview(id);
     } catch (error) {
       this.logger.error(`shippings/findAll failed: ${error}`)
       throw error
     }

  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    try {
    return this.reviewService.update(id, updateReviewDto);

     } catch (error) {
       this.logger.error(`shippings/findAll failed: ${error}`)
       throw error
     }

  }

  // delete a review
  @Delete(':id')
  delete(@Param('id') id: string) {
    try {

    return this.reviewService.delete(id);
     } catch (error) {
       this.logger.error(`shippings/findAll failed: ${error}`)
       throw error
     }

  }

  
}
