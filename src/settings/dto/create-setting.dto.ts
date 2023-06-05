import { OmitType, PartialType } from '@nestjs/swagger';
import { Setting } from '../entities/setting.entity';

export class CreateSettingDto extends PartialType(Setting) {}
// , [
//   'created_at',
//   'updated_at',
// ]