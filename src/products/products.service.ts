import productsJson from '@db/products.json';
import {HttpException,HttpStatus,Injectable,Req} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {plainToClass} from 'class-transformer';
import {Model} from 'mongoose';
import {AuthorsService} from 'src/authors/authors.service';
import {paginate} from 'src/common/pagination/paginate';
import {ManufacturersService} from 'src/manufacturers/manufacturers.service';
import {ShopsService} from 'src/shops/shops.service';
import {CreateProductDto} from './dto/create-product.dto';
import {GetPopularProductsDto} from './dto/get-popular-products.dto';
import {GetProductsDto,ProductPaginator} from './dto/get-products.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {Product,ProductDocument} from './entities/product.entity';

const products = plainToClass(Product, productsJson);

const options = {
  keys: [
    'name',
    'type.slug',
    'categories.slug',
    'status',
    'shop_id',
    'author.slug',
    'tags',
    'manufacturer.slug',
  ],
  threshold: 0.3,
};


@Injectable()
export class ProductsService {
  private products: any = products;

  constructor(
    @InjectModel('Product') private _product: Model<ProductDocument>,
    private authorService: AuthorsService,
    private manufacturerService: ManufacturersService,
    private shopService: ShopsService

  ) { }

  async create(createProductDto: CreateProductDto, user: any) {
    try {
      createProductDto.user_id = user.id;
      const createdProduct = await this._product.create(createProductDto)

      if (createdProduct?._id) {

        if(createProductDto?.author_id){
             const author = await this.authorService.getAuthorById(createProductDto.author_id);
        author?.products_count.push(createdProduct._id.toString())
        this.authorService.updateAuthor(author?._id.toString(), author)
        }
     
        if(createProductDto?.manufacturer_id){
          const manufacturer = await this.manufacturerService.getManufacturesById(createProductDto.manufacturer_id);
          manufacturer?.products_count.push(createdProduct._id.toString())
          await this.manufacturerService.update(manufacturer?._id.toString(), manufacturer)
        }
        if(createProductDto.shop_id){
            const shopId = createProductDto.shop_id.toString()
          const shop = await this.shopService.getShopById(shopId);
          shop?.products_count.push(createdProduct._id.toString())
          await this.shopService.update(shop?._id.toString(), shop) 
        }
  
        return createdProduct;
      }

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getProducts({ limit, page, search, shop_id }: GetProductsDto, @Req() req:any = "test" ): Promise<ProductPaginator> {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    var data: Product[];

    if(shop_id){

      
       data = await this._product.find({shop_id})
       .populate('type_id')
       .populate('manufacturer_id')
       .populate('shop_id')
       .populate('author_id')
       .populate('categories')
      //  .exec( err:any => console.log(err));



    }else if(search){
      const parseSearchParams = search.split(';');
      const searchText: any = [];
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // TODO: Temp Solution
        if (key !== 'slug') {
          searchText.push({
            [key]: value,
          });
        }
      }

      // data = fuse
      //   .search({
      //     $and: searchText,
      //   })?.map(({ item }) => item);

        const [one, two] = searchText;

      data = await this._product.find( {$and:[two, one]} ).populate('type_id').populate('shop_id').populate('manufacturer_id').populate('categories').populate('author_id')
      // data = await this._product.find({ shop_id: searchText[0].shop_id }).populate('type_id').populate('shop_id').populate('manufacturer_id')
    }else{
      data = await this._product.find().populate('type_id').populate('manufacturer_id').populate('shop_id').populate('author_id').populate('categories');
    }

    // const fuse = new Fuse(data, options);
  

    const results = data.slice(startIndex, endIndex);
    const url = `/products?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, data.length, url),
    };
  }

  async getProductBySlug(slug: string): Promise<Product> {
    // const product = this.products.find((p) => p.slug === slug);
    const test = (await this._product.findOne({ slug: slug }).populate('shop_id').populate('type_id')).populate('author_id');
    // let product
    // if(test && test?._doc){
     const product = (await test)?._doc
    // }

    // const related_products = this.products
    //   .filter((p) => p.type.slug === product.type.slug)
    //   .slice(0, 20);
    const related_products = await this._product.find({
      type_id: product?.type_id
    }).limit(10)

    // return product;

    return {
      ...product,
      related_products
    };

  }

  async getPopularProducts({ limit, type_slug }: GetPopularProductsDto): Promise< Product[]> {
    const data: any = await this._product.find({type: {slug: type_slug}}).populate('type_id').limit(limit);
    // const fuse = new Fuse(data, options);
    // if (type_slug) {
    //   data = fuse.search(type_slug)?.map(({ item }) => item);
    // }
    return data;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this._product.findByIdAndUpdate(id, updateProductDto);
  }

  remove(id: string) {
    return this._product.findByIdAndDelete(id);
  }


}
