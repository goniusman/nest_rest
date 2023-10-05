import exportOrderJson from '@db/order-export.json';
import orderInvoiceJson from '@db/order-invoice.json';
import orderStatusJson from '@db/order-statuses.json';
// import orderFilesJson from '@db/order-files.json';
// import ordersJson from '@db/orders.json';
// import paymentGatewayJson from '@db/payment-gateway.json';
// import paymentIntentJson from '@db/payment-intent.json';
import setting from '@db/settings.json';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { paginate } from 'src/common/pagination/paginate';
import { PaymentIntent } from 'src/payment-intent/entries/payment-intent.entity';
import { PaymentGateWay } from 'src/payment-method/entities/payment-gateway.entity';
import { PaypalPaymentService } from 'src/payment/paypal-payment.service';
import { StripePaymentService } from 'src/payment/stripe-payment.service';
import { ProductsService } from 'src/products/products.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { SettingsService } from 'src/settings/settings.service';
import {
  CreateOrderStatusDto,
  UpdateOrderStatusDto,
} from './dto/create-order-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderFilesDto } from './dto/get-downloads.dto';
import {
  GetOrderStatusesDto,
  OrderStatusPaginator,
} from './dto/get-order-statuses.dto';
import { GetOrdersDto, OrderPaginator } from './dto/get-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  CheckoutVerificationDto,
  VerifiedCheckoutData,
} from './dto/verify-checkout.dto';
import { OrderStatus } from './entities/order-status.entity';
import {
  Order,
  OrderFiles,
  OrderStatusType,
  PaymentGatewayType,
  PaymentStatusType,
} from './entities/order.entity';
import { ShopsService } from 'src/shops/shops.service';

// const orders = plainToClass(Order, ordersJson);
const orderStatus = plainToClass(OrderStatus, orderStatusJson);
// const paymentIntents = plainToClass(PaymentIntent, paymentIntentJson);
// const paymentGateways = plainToClass(PaymentGateWay, paymentGatewayJson);

const options = {
  keys: ['name'],
  threshold: 0.3,
};

const productOptions = {
  keys: ['shop_id'],
  threshold: 0.3,
};

// const fuse = new Fuse(orderStatus, options);

// const orderFiles = plainToClass(OrderFiles, orderFilesJson);
const settings = plainToClass(Setting, setting);

@Injectable()
export class OrdersService {
  // private orders: Order[] = orders;
  // private orderStatus: OrderStatus[] = orderStatus;
  // private orderFiles: OrderFiles[] = orderFiles;
  // private setting: Setting = this.settingService.findAll()[0];

  constructor(
    @InjectModel('Order') private _orders: Model<Order>,
    @InjectModel('OrderStatus') private _orderStatus: Model<OrderStatus>,
    @InjectModel('OrderFiles') private _orderFiles: Model<OrderFiles>,
    @InjectModel('PaymentIntent') private _paymentIntents: Model<PaymentIntent>,
    @InjectModel('PaymentGateWay') private _paymentGateWays: Model<PaymentGateWay>,

    private readonly authService: AuthService,
    private readonly stripeService: StripePaymentService,
    private readonly paypalService: PaypalPaymentService,
    private readonly productService: ProductsService,
    private readonly shopService: ShopsService, 
    private readonly settingService: SettingsService, 
  ) {
    // console.log(setting);
  }

  async create(createOrderInput: CreateOrderDto): Promise<any> {

    try {

    //  const settings =  this.settingService.findAll()[0]
      // const order = await this._orders.find();

      const payment_gateway_type = createOrderInput.payment_gateway
        ? createOrderInput.payment_gateway
        : PaymentGatewayType.CASH_ON_DELIVERY;

      createOrderInput.payment_gateway = payment_gateway_type;
      createOrderInput.payment_intent = null;
      createOrderInput.tracking_number = this.trackingNumber()
      // set the order type and payment type
      switch (payment_gateway_type) {
        case PaymentGatewayType.CASH_ON_DELIVERY:
          createOrderInput.order_status = OrderStatusType.PROCESSING;
          createOrderInput.payment_status = PaymentStatusType.CASH_ON_DELIVERY;
          break;
        case PaymentGatewayType.CASH:
          createOrderInput.order_status = OrderStatusType.PROCESSING;
          createOrderInput.payment_status = PaymentStatusType.CASH;
          break;
        case PaymentGatewayType.FULL_WALLET_PAYMENT:
          createOrderInput.order_status = OrderStatusType.COMPLETED;
          createOrderInput.payment_status = PaymentStatusType.WALLET;
          break;
        default:
          createOrderInput.order_status = OrderStatusType.PENDING;
          createOrderInput.payment_status = PaymentStatusType.PENDING;
          break;
      }
      let createdOrder = await this._orders.create(createOrderInput)
      let parentOrderId = createdOrder._id
      const allProductsIds = createOrderInput.products.map(product => product.product);
      let products = await this.productService.getProductByIDs(allProductsIds);
      // let fuse = new Fuse(products, productOptions);
      const obj = {}
      products.forEach(product => {
        obj[product.shop_id._id] = obj[product.shop_id._id] ? obj[product.shop_id._id] + 1 : 1
      })
      let createChildOrder;
      let objKeys = Object.keys(obj)
      if(objKeys.length > 1){
        const productsPrev = createOrderInput.products;
        for (const key in obj) {
          if(obj.hasOwnProperty(key)){
            let shopId = key 
            createOrderInput.products = productsPrev
              const shopBaseProductIds = await products.filter((product) => { 
                return product.shop_id.toString() === shopId
              }) 
              let ids = []
              shopBaseProductIds.forEach(product => ids.push(product?._id.toString()))
              const filteredProducts = createOrderInput.products.filter(item => ids.includes(item.product) )
              createOrderInput.products = filteredProducts;
              const total = await this.calculateTotal(createOrderInput.products)
              createOrderInput.amount = total;
              createOrderInput.total = total;
              createOrderInput.paid_total = total;
              createChildOrder = await this.processChildrenOrder(createOrderInput, shopId, parentOrderId);
              createdOrder.children.push(createChildOrder?._id) 
              await this._orders.findByIdAndUpdate(parentOrderId, createdOrder)
              let shop = await this.shopService.getShopById(shopId)
              shop?.orders_count.push(createChildOrder?._id) 
              await this.shopService.update(shopId, shop)
          }
        }
      }else{
        let shopId = objKeys[0]
        let shop = await this.shopService.getShopById(shopId)
         shop?.orders_count.push(parentOrderId) 
         await this.shopService.update(shopId, shop)
        createdOrder.shop = shopId;
        this._orders.findByIdAndUpdate(createdOrder._id, createdOrder)
      }

        // if (
        //   [
        //     PaymentGatewayType.STRIPE,
        //     PaymentGatewayType.PAYPAL,
        //     PaymentGatewayType.RAZORPAY,
        //   ].includes(payment_gateway_type)
        // ) {
        //   const paymentIntent = await this.processPaymentIntent(
        //     createOrderInput,
        //     this.setting,
        //   );
        //   createOrderInput.payment_intent = paymentIntent;
        // }

       return await this._orders.findById(parentOrderId);

    } catch (error) {

      throw error;
    }

  }

  async getOrders({
    limit,
    page,
    customer_id,
    tracking_number,
    search,
    shop_id,
  }: GetOrdersDto): Promise<OrderPaginator> {
// console.log(shop_id);
    if (!page) page = 1;
    if (!limit) limit = 15;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Order[] = []

    if( customer_id && customer_id !== undefined ){
       data = await this._orders.find({customer:customer_id})
       .populate('status customer children parent_order')
       .populate({
        path: 'products.product',
        model: 'Product' });
    }else if(shop_id && shop_id !== undefined) {
      data = await this._orders.find({shop: shop_id})
      .populate('status customer children parent_order')
      .populate({
       path: 'products.product',
       model: 'Product' });;
    }else{
      data = await this._orders.find({parent_order: {$exists: false}}).populate('status customer children parent_order')
      .populate({
       path: 'products.product',
       model: 'Product' });;
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/orders?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getOrderByIdOrTrackingNumber(tracking_number: any): Promise<any> {
    try {

      
      const order = await this._orders.findOne({tracking_number})
      .populate('children parent_order')
      .populate({
        path: 'status',
        model: 'OrderStatus'
       })
      .populate({
        path: 'products.product',
        model: 'Product'
       }
      )
      
    //   .exec(function(err, data){
    //     if (err) return console.log(err);
    //     res.json(data);
    // });


      return order;
    } catch (error) {
      throw error;
    }
  }

  async getOrderStatuses({
    limit,
    page,
    search,
    orderBy,
    // shop_id,
  }: GetOrderStatusesDto): Promise<OrderStatusPaginator> {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: OrderStatus[] = await this._orderStatus.find();

    // if (shop_id) {
    //   data = this._orders?.filter((p) => p?.shop?.id === shop_id);
    // }

    if (search) {
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
      //   })
      //   ?.map(({ item }) => item);
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/order-status?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getOrderStatus(param: string, language: string = 'en') {
    // return await this._orderStatus.findOne({name: param}).select('name email').exec();
  //  let sta =  OrderStatusType[param] == param;
  //  console.log(sta);
    return await this._orderStatus.findOne({slug: param});
  }

  async update(id: any, updateOrderInput: UpdateOrderDto) {
    try {
        let status = updateOrderInput.order_status
    if(status){
      let statusId = await this.getOrderStatus(status)
      updateOrderInput.status = statusId;
      return this._orders.findByIdAndUpdate(id, updateOrderInput)
    }else{
      return this._orders.findByIdAndUpdate(id, updateOrderInput)
    }
    } catch (error) {
      throw error;
    }
  
  }

  remove(id: any) {
    return this._orders.findByIdAndDelete(id)
  }

  verifyCheckout(input: CheckoutVerificationDto): VerifiedCheckoutData {
    return {
      total_tax: 0,
      shipping_charge: 0,
      unavailable_products: [],
      wallet_currency: 0,
      wallet_amount: 0,
    };
  }

  createOrderStatus(createOrderStatusInput: CreateOrderStatusDto) {
    return this._orderStatus[0];
  }

  updateOrderStatus(updateOrderStatusInput: UpdateOrderStatusDto) {
    return this._orderStatus[0];
  }

  async getOrderFileItems({ page, limit }: GetOrderFilesDto) {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = await this._orderFiles.find();

    const url = `/downloads?&limit=${limit}`;
    return {
      data: results,
      ...paginate(this._orderFiles.length, page, limit, results.length, url),
    };
  }

  async getDigitalFileDownloadUrl(digitalFileId: number) {
    const item = await this._orderFiles.findOne(
      (singleItem) => singleItem.digital_file_id === digitalFileId,
    );

    return item?.file.url;
  }

  async exportOrder(shop_id: string) {
    return exportOrderJson.url;
  }

  async downloadInvoiceUrl(shop_id: string) {
    return orderInvoiceJson[0].url;
  }

  /**
   * helper methods from here
   */

  /**
   * this method will process children of Order Object
   * @param order
   * @returns Children[]
   */
  async processChildrenOrder(createOrderInput: CreateOrderDto, shopId, parentOrderId) {
   
    try {
      
   
    const payment_gateway_type = createOrderInput.payment_gateway
        ? createOrderInput.payment_gateway
        : PaymentGatewayType.CASH_ON_DELIVERY;

      createOrderInput.payment_gateway = payment_gateway_type;
      createOrderInput.payment_intent = null;
      createOrderInput.tracking_number = this.trackingNumber()
      // set the order type and payment type

      switch (payment_gateway_type) {
        case PaymentGatewayType.CASH_ON_DELIVERY:
          createOrderInput.order_status = OrderStatusType.PROCESSING;
          createOrderInput.payment_status = PaymentStatusType.CASH_ON_DELIVERY;
          break;
        case PaymentGatewayType.CASH:
          createOrderInput.order_status = OrderStatusType.PROCESSING;
          createOrderInput.payment_status = PaymentStatusType.CASH;
          break;
        case PaymentGatewayType.FULL_WALLET_PAYMENT:
          createOrderInput.order_status = OrderStatusType.COMPLETED;
          createOrderInput.payment_status = PaymentStatusType.WALLET;
          break;
        default:
          createOrderInput.order_status = OrderStatusType.PENDING;
          createOrderInput.payment_status = PaymentStatusType.PENDING;
          break;
      }

      createOrderInput.shop = shopId;
      createOrderInput.parent_order = parentOrderId

      return await this._orders.create(createOrderInput)

      // return {}
    } catch (error) {
      throw error;
    }

  }
  /**
   * This action will return Payment Intent
   * @param order
   * @param setting
   */
  async processPaymentIntent(
    order: any,
    setting: Setting,
  ): Promise<any> {
    const paymentIntent = await this._paymentIntents.find(
      (intent: PaymentIntent) =>
        intent.tracking_number === order.tracking_number &&
        intent.payment_gateway.toString().toLowerCase() ===
        setting.options.paymentGateway.toString().toLowerCase(),
    );

    if (paymentIntent) {
      return paymentIntent;
    }

    const {
      id: payment_id,
      client_secret = null,
      redirect_url = null,
      customer = null,
    } = await this.savePaymentIntent(order, setting.options.paymentGateway);
    const is_redirect = redirect_url ? true : false;
    const paymentIntentInfo = {
      // id: Number(Date.now()),
      order_id: order.id,
      tracking_number: order.tracking_number,
      payment_gateway: order.payment_gateway.toString().toLowerCase(),
      payment_intent_info: {
        client_secret: client_secret,
        payment_id: payment_id,
        redirect_url: redirect_url,
        is_redirect: is_redirect,
      },
    };

    /**
     * Commented below code will work for real database.
     * if you uncomment this for json will arise conflict.
     */

    this._paymentIntents.create(paymentIntentInfo);
    // const user = await this.authService.me()
    const paymentGateway: PaymentGateWay = {
      // id: Number(Date.now()),
      // user_id: user._id.toString(),
      user_id: "345345",
      customer_id: customer,
      gateway_name: setting.options.paymentGateway,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this._paymentGateWays.create(paymentGateway);

    return paymentIntentInfo;
  }

  /**
   * Trailing method of ProcessPaymentIntent Method
   *
   * @param order
   * @param paymentGateway
   */
  async savePaymentIntent(order: Order, paymentGateway?: string): Promise<any> {
    const me = await this.authService.me("dsfaf");
    switch (order.payment_gateway) {
      case PaymentGatewayType.STRIPE:
        const paymentIntentParam =
          await this.stripeService.makePaymentIntentParam(order, me);
        return await this.stripeService.createPaymentIntent(paymentIntentParam);
      case PaymentGatewayType.PAYPAL:
        // here goes PayPal
        return this.paypalService.createPaymentIntent(order);
        break;

      default:
        //
        break;
    }
  }

  /**
   *  Route {order/payment} Submit Payment intent here
   * @param order
   * @param orderPaymentDto
   */
  async stripePay(order: Order) {
    this._orders[0]['order_status'] = OrderStatusType.PROCESSING;
    this._orders[0]['payment_status'] = PaymentStatusType.SUCCESS;
    this._orders[0]['payment_intent'] = null;
  }

  async paypalPay(order: Order) {
    this._orders[0]['order_status'] = OrderStatusType.PROCESSING;
    this._orders[0]['payment_status'] = PaymentStatusType.SUCCESS;
    const { status } = await this.paypalService.verifyOrder(
      order.payment_intent.payment_intent_info.payment_id,
    );
    this._orders[0]['payment_intent'] = null;
    if (status === 'COMPLETED') {
      //console.log('payment Success');
    }
  }

  /**
   * This method will set order status and payment status
   * @param orderStatus
   * @param paymentStatus
   */
  changeOrderPaymentStatus(
    orderStatus: OrderStatusType,
    paymentStatus: PaymentStatusType,
  ) {
    this._orders[0]['order_status'] = orderStatus;
    this._orders[0]['payment_status'] = paymentStatus;
  }



   trackingNumber (pr = "UB775", su = "HK") {


    for(let i=0; i<5; i++) pr += ~~(Math.random() * 10);
    return pr + su;

    // console.log(trackingNumber()); 
    // console.log(trackingNumber());
    // console.log(trackingNumber());
    // console.log(trackingNumber());
    
    // // Example changing prefix and suffix:
    // console.log(trackingNumber("ZA001", "PD"));


  };
  

   calculateItemTotals = (items: any[]) =>
    items.map((item) => ({
      ...item,
      itemTotal: item.price * item.quantity!,
    }));

  calculateTotal = (items: any[]) =>
    items.reduce((total, item) => total + item.order_quantity! * item.unit_price, 0);

  calculateTotalItems = (items: any[]) =>
    items.reduce((sum, item) => sum + item.quantity!, 0);

  calculateUniqueItems = (items: any[]) => items.length;
  

}




// product: product?.productId ? product?.productId : product?._id,
// ...(product?.variationId
//   ? { variation_option_id: product?.variationId }
//   : {}),
// order_quantity: product?.quantity,
// unit_price: product?.price,
// subtotal: product?.itemTotal,


