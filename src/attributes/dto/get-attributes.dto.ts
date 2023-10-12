import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Attribute } from '../entities/attribute.entity';
import { Paginator } from 'src/common/dto/paginator.dto';




export class AttributePaginator extends Paginator<Attribute> {
  data: Attribute[];
}
export class GetAttributesArgs extends PaginationArgs {
  orderBy?: QueryAttributesOrderByOrderByClause[];
  shop?: any;
  search?: string;
  language?: string;
}

export class QueryAttributesOrderByOrderByClause {
  column: QueryAttributesOrderByColumn;
  order: SortOrder;
}
export enum QueryAttributesOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}















