import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthorsService } from 'src/authors/authors.service';
import { CategoriesService } from 'src/categories/categories.service';
import { paginate } from 'src/common/pagination/paginate';
import { ManufacturersService } from 'src/manufacturers/manufacturers.service';
import { ShopsService } from 'src/shops/shops.service';
import { TypesService } from 'src/types/types.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetPopularProductsDto } from './dto/get-popular-products.dto';
import { GetProductsDto, ProductPaginator } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';
// const products = plainToClass(Product, productsJson);

const options = {
  keys: [
    'name',
    'type.slug',
    'categories.slug',
    'status',
    'shop',
    'author.slug',
    'tags',
    'manufacturer.slug',
  ],
  threshold: 0.3,
};


@Injectable()
export class ProductsService {
  // private products: any = products;

  constructor(
    @InjectModel('Product') private _product: Model<ProductDocument>,
    private authorService: AuthorsService,
    private manufacturerService: ManufacturersService,
    private shopService: ShopsService,
    private catService: CategoriesService,
    private typeService: TypesService

  ) { }

  async create(createProductDto: CreateProductDto, user: any) {
    try {
      createProductDto.user = user.id;
      const createdProduct = await this._product.create(createProductDto)

      if (createdProduct?._id) {

        if(createProductDto?.author){
             const author = await this.authorService.getAuthorById(createProductDto.author);
        author?.products_count.push(createdProduct._id.toString())
        this.authorService.updateAuthor(author?._id.toString(), author)
        }
     
        if(createProductDto?.manufacturer){
          const manufacturer = await this.manufacturerService.getManufacturesById(createProductDto.manufacturer);
          manufacturer?.products_count.push(createdProduct._id.toString())
          await this.manufacturerService.update(manufacturer?._id.toString(), manufacturer)
        }
        if(createProductDto.shop){
            const shopId = createProductDto.shop.toString()
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

  async getProducts({ limit, page, search, shop }: GetProductsDto, @Req() req:any = "test" ): Promise<ProductPaginator> {

    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    var data: Product[] = []

   if(search){

      const parseSearchParams = search.split(';');
      for (const [i, searchParam] of parseSearchParams.entries()) {
        // console.log( searchParam);
        if(searchParam.includes("type")){
          const typeStr = parseSearchParams[i]
          const [key, value] = typeStr.split(':');
          // console.log(typeStr);
          let type = await this.typeService.getTypeBySlug(value)
          data = await this._product.find({type: type?._id}).lean().populate({
            path: 'categories',
            model: 'Category'
           }).populate('type shop manufacturer author user')
          

        }else if(searchParam.includes("categories")){
          const categoryStr = parseSearchParams[i]
          const [key, value] = categoryStr.split(':');
 
          const category = await this.catService.getCategoryBySlug(value)
          data = await this._product.find({
            categories: {
              $elemMatch: {
                $in: [category?._id] 
              }
            }
          }).lean().populate('type shop manufacturer author user') .populate({
            path: 'categories',
            model: 'Category'
           })
          
        }else if(searchParam.includes("shop")){

          const shopStr = parseSearchParams[i]
          const [key, value] = shopStr.split(':');
          console.log(shopStr);
          data = await this._product.find({shop: value}).lean().populate('type shop manufacturer author user').populate({
            path: 'categories',
            model: 'Category'
           })
       
       
        }else if(searchParam.includes("name")){
          const shopStr = parseSearchParams[i]
          const [key, value] = shopStr.split(':');
          
          var re = new RegExp(value, 'i');
          data = await this._product.find(
            {$or: [{name: re },{description: re}, {status: re}]}
          )
          .lean()
          .populate('type shop manufacturer author user').populate({
            path: 'categories',
            model: 'Category'
           })
          .exec();

          // { $and: [ { $or: [{title: re },{description: re}] }, {category: value.category}, {city:value.city} ] } // working with multiple query
          // .or([{ 'name': { $regex: re }}, { 'description': { $regex: re }}]) //// not working as expected, it's work on mongo database client
          // console.log(data.length);

        }

      }

    }else{
      console.log('yes here');
      data = await this._product.find().populate('type shop manufacturer author user categories tags')
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/products?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, data.length, url),
    }; 
  }

  async getProductBySlug(slug: string): Promise<Product> {
    // const product = this.products.find((p) => p.slug === slug);
    const test = await this._product.findOne({ slug: slug }).populate('type shop manufacturer author user categories tags')
    // let product
    // if(test && test?._doc){
     const product = (await test)?._doc
    // }

    // const related_products = this.products
    //   .filter((p) => p.type.slug === product.type.slug)
    //   .slice(0, 20);
    const related_products = await this._product.find({
      type: product?.type
    }).populate('type shop manufacturer author user categories tags').limit(10)

    // return product;

    return {
      ...product,
      related_products
    };

  }


  async getProductByIDs(ids: any): Promise<any> {
    // const product = this.products.find((p) => p.slug === slug);
    const Products = await this._product.find({ _id: { $in: ids }})
    .populate('type shop manufacturer author user categories tags')

  return Products;

  }

  async getPopularProducts({ limit, type_slug }: GetPopularProductsDto): Promise< Product[]> {

    // const data: any = await this._product.find({type: {slug: type_slug}}).populate({
    //   path: 'categories',
    //   model: 'Category'
    //  }).populate('type shop manufacturer author user').limit(limit);
    // const fuse = new Fuse(data, options);
    // if (type_slug) {
    //   data = fuse.search(type_slug)?.map(({ item }) => item);
    // }
    return await this._product.find().populate('type shop manufacturer author user');
    
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this._product.findByIdAndUpdate(id, updateProductDto);
  }

  remove(id: string) {
    return this._product.findByIdAndDelete(id);
  }


}
