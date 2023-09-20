import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateReportDto} from './dto/create-report.dto';
import {UpdateReportDto} from './dto/update-report.dto';
import {Report} from './entities/reports.entity';

@Injectable()
export class AbusiveReportService {

constructor (@InjectModel('Report') private _reports : Model<Report>) {
  
}

  findAllReports() {
    return this._reports.find();
  }

  findReport(id: any) {
    return this._reports.findById(id);
  }

  create(createReportDto: CreateReportDto) {
    return this._reports.create(createReportDto);
  }

  update(id: any, updateReportDto: UpdateReportDto) {
    return this._reports.findByIdAndUpdate(id, updateReportDto);
  }

  delete(id: any) {
    return this._reports.findByIdAndDelete(id);
  }
}
