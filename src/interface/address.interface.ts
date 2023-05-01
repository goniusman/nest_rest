import { Document } from 'mongoose';

export interface IAddress extends Document{
  // readonly _id : string;
  readonly title: string;
  readonly default: string;
  readonly address: Object;
  readonly type: string;
  readonly customer: string;

}
