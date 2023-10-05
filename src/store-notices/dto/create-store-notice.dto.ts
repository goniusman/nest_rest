import { PartialType, PickType } from '@nestjs/swagger';
import { StoreNotice } from '../entities/store-notices.entity';

export class CreateStoreNoticeDto extends PartialType(StoreNotice) {}
