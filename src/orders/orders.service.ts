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

// const orders = plainToClass(Order, ordersJson);
const orderStatus = plainToClass(OrderStatus, orderStatusJson);
// const paymentIntents = plainToClass(PaymentIntent, paymentIntentJson);
// const paymentGateways = plainToClass(PaymentGateWay, paymentGatewayJson);

const options = {
  keys: ['name'],
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
    private readonly settingService: SettingsService,
  ) {
    // console.log(setting);
  }

  async create(createOrderInput: CreateOrderDto): Promise<Order> {

    try {

     const settings =  this.settingService.findAll()[0]
      // const order = await this._orders.find();

      const payment_gateway_type = createOrderInput.payment_gateway
        ? createOrderInput.payment_gateway
        : PaymentGatewayType.CASH_ON_DELIVERY;

      createOrderInput.payment_gateway = payment_gateway_type;
      createOrderInput.payment_intent = null;
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

      // createOrderInput.children = this.processChildrenOrder(createOrderInput);

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

       return  this._orders.create(createOrderInput)

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
    if (!page) page = 1;
    if (!limit) limit = 15;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let data: Order[] = await this._orders.find();
    console.log('hello get order method');
    if (shop_id && shop_id !== 'undefined') {
      // data = this._orders?.filter((p) => p?.shop?.id === Number(shop_id));
    }
    const results = data.slice(startIndex, endIndex);
    const url = `/orders?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getOrderByIdOrTrackingNumber(id: any): Promise<Order> {
    try {
      return await this._orders.findById(id)
    } catch (error) {
      console.log(error);
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

  getOrderStatus(param: string, language: string) {
    return this._orderStatus.find((p) => p.slug === param);
  }

  update(id: any, updateOrderInput: UpdateOrderDto) {
    return this._orders[0];
  }

  remove(id: any) {
    return `This action removes a #${id} order`;
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
  processChildrenOrder(order: Order) {
    return [...order.children].map((child) => {
      child.order_status = order.order_status;
      child.payment_status = order.payment_status;
      return child;
    });
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
    const user = await this.authService.me()
    const paymentGateway: PaymentGateWay = {
      // id: Number(Date.now()),
      user_id: user._id.toString(),
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
    const me = await this.authService.me();
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


}
