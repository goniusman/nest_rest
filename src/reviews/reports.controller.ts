import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { AbusiveReportService } from './reports.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Abusive_reports")
@Controller('abusive_reports')
// @HasRoles(Role.STORE_OWNER, Role.SUPER_ADMIN, Role.CUSTOMER, Role.STAFF)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class AbusiveReportsController {

  private readonly logger = new Logger();
  
  constructor(private reportService: AbusiveReportService) {}

  @Get()
  async findAll() {
    try {

      return this.reportService.findAllReports();
       } catch (error) {
         this.logger.error(`reports/findAll failed: ${error}`)
         throw error
       }

  }

  // get single feedback
  @Get(':id')
  find(@Param('id') id: any) {

   
    try {

       return this.reportService.findReport(id);
       } catch (error) {
         this.logger.error(`reports/find failed: ${error}`)
         throw error
       }
  }

  // create a new feedback
  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    try {

      return this.reportService.create(createReportDto);
       } catch (error) {
         this.logger.error(`reports/create failed: ${error}`)
         throw error
       }

  }

  // update a feedback
  @Put(':id')
  update(@Param('id') id: any, @Body() updateReportDto: UpdateReportDto) {
    try {
   return this.reportService.update(id, updateReportDto);
  
       } catch (error) {
         this.logger.error(`reports/update failed: ${error}`)
         throw error
       }
 
  }

  // delete a feedback
  @Delete(':id')
  delete(@Param('id') id: any) {
    try {
    return this.reportService.delete(id);
       } catch (error) {
         this.logger.error(`reports/delete failed: ${error}`)
         throw error
       }

  }
}
