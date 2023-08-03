import { Document } from 'mongoose';
import { Permission } from '../users.service';
import { Profile} from '../entities/user.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { Order } from 'src/orders/entities/order.entity';


export interface IUser extends Document{
    readonly name?: string;
    readonly email?: string;
    readonly permissions?: Permission[];
    readonly managed_shop?: Shop;
    readonly email_verified_at?: boolean;
    // readonly profile?: Profile;
    // readonly shops?: Shop[];
    readonly is_active?: boolean;
    // readonly address?: Address[];
    readonly orders?: Order[];
    readonly shop_id?: Shop;
}


  // @Prop({ type:  mongoose.Schema.Types.ObjectId, ref: 'Shop', required: false })
  // shop_id?: Shop;







