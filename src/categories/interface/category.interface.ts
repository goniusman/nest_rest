import { Document, Types } from 'mongoose';
import { Product } from 'src/products/entities/product.entity';


export interface ICategory extends Document{
     name: string;
    readonly slug: number;
    readonly details: number;
    readonly parent: Types.ObjectId;
    readonly products: Product[];
}