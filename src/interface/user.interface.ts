import { Document } from 'mongoose';

export interface IUser extends Document{
  // readonly _id : string;
  readonly name: string;
  readonly password: string;
  readonly email: string;
  readonly email_verified_at: string;
  readonly shop_id: number;
  readonly is_active: boolean;
  // readonly created_at: Date;
}
