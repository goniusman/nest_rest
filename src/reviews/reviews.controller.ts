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
  UseGuards
} from '@nestjs/common';
import { HasRoles } from 'src/auth/gurd/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/gurd/jwt-auth.guard';
import { Role } from 'src/auth/gurd/role.enum';
import { RolesGuard } from 'src/auth/gurd/roles.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsDto } from './dto/get-reviews.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './reviews.service';
@Controller('reviews')
// @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewController {

    
  private readonly logger = new Logger();
  
  constructor(private readonly reviewService: ReviewService) {}


  //  create a new review
  @Post()
  // @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    try {
      createReviewDto.customer = req.user.id;
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
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async find(@Param('id') id: any, @Req() req: any) {
    try {

    return await this.reviewService.findReview(id, req?.user);
     } catch (error) {
       this.logger.error(`shippings/find failed: ${error}`)
       throw error
     }

  }

  @Put(':id')
  @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
