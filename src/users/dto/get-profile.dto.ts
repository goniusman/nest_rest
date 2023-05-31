import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';

import { Profile } from '../entities/profile.entity';
// import {  Profile } from '../../profiles/schema/profile.schema';


export class ProfilePaginator extends Paginator<Profile> {
  data: Profile[];
}

export class GetProfilesDto extends PaginationArgs {
  orderBy?: QueryProfilesOrderByColumn;
  sortedBy?: SortOrder;
  text?: string;
  search?: string;
}

export enum QueryProfilesOrderByColumn {
  NAME = 'name',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  IS_ACTIVE = 'IS_ACTIVE',
}
