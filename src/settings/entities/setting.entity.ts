import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {type} from 'os';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

export type SettingDocument = Setting & Document


export class SettingsOptions extends mongoose.Document{
  siteTitle: string;
  siteSubtitle: string;
  useOtp: boolean;
  currency: string;
  minimumOrderAmount: number;
  walletToCurrencyRatio: number;
  signupPoints: number;
  deliveryTime: DeliveryTime[];
  logo: Attachment;
  taxClass: string;
  shippingClass: string;
  seo: SeoSettings;
  google?: GoogleSettings;
  facebook?: FacebookSettings;
  contactDetails: ContactDetails;
  paymentGateway: string;
  maximumQuestionLimit: number;
  currencyOptions: CurrencyOptions;
  currencyToWalletRatio: number;
  defaultAi: string;
  defaultPaymentGateway: string;
  emailEvent: EmailEvent;
  freeShipping: boolean;
  freeShippingAmount: any;
  guestCheckout: boolean;
  isProductReview: boolean;
  maxShopDistance: number;
  server_info: ServerInfo;
  smsEvent: SmsEvent;
  StripeCardOnly: boolean;
  useAi: boolean;
  useCashOnDelivery: boolean;
  useEnableGateway: boolean;
  useGoogleMap: boolean;
  useMustVerifyEmail: boolean;

}

export class DeliveryTime extends mongoose.Document{
  title: string;
  description: string;
}

export class SeoSettings extends mongoose.Document{
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: Attachment;
  twitterHandle?: string;
  twitterCardType?: string;
  metaTags?: string;
  canonicalUrl?: string;
}

export class GoogleSettings extends mongoose.Document{
  isEnable: boolean;
  tagManagerId: string;
}

export class FacebookSettings extends mongoose.Document{
  isEnable: boolean;
  appId: string;
  pageId: string;
}

export class ContactDetails extends mongoose.Document {
  socials: ShopSocials[];
  contact: string;
  location: Location;
  website: string;
}
  
export class ShopSocials extends mongoose.Document {
  icon: string;
  url: string;
}

export class Location extends mongoose.Document  {
  lat: number;
  lng: number;
  city?: string;
  state: string;
  country: string;
  zip?: string;
  formattedAddress: string;
}


export class SmsEvent {
  admin: SmsAdmin;
  vendor: SmsVendor;
  customer: SmsCustomer;
}
export class SmsAdmin {
  refundOrder: boolean;
  paymentOrder: boolean;
  statusChangeOrder: boolean;
}

export class SmsVendor {
  refundOrder: boolean;
  paymentOrder: boolean;
  statusChangeOrder: boolean;
}

export class SmsCustomer {
  refundOrder: boolean;
  paymentOrder: boolean;
  statusChangeOrder: boolean;
}

export class EmailEvent {
  admin: EmailAdmin;
  vendor: EmailVendor;
  customer: EmailCustomer;
}
export class EmailAdmin {
  refundOrder: boolean;
  paymentOrder: boolean;
  statusChangeOrder: boolean;
}

export class EmailVendor {
  refundOrder: boolean;
  createReview: boolean;
  paymentOrder: boolean;
  createQuestion: boolean;
  statusChangeOrder: boolean;
}

export class EmailCustomer {
  refundOrder: boolean;
  paymentOrder: boolean;
  answerQuestion: boolean;
  statusChangeOrder: boolean;
}
export class ServerInfo {
  memory_limit: string;
  post_max_size: number;
  max_input_time: string;
  max_execution_time: string;
  upload_max_filesize: number;
}
export class PaymentGateway {
  name: string;
  title: string;
}
export class CurrencyOptions {
  formation: string;
  fractions: number;
}

@Schema({timestamps: true})
export class Setting  {

  @Prop({type: SettingsOptions, required: false})
  options: SettingsOptions;

  @Prop({type: String, required: false})
  language: string;

  @Prop({type: [String], required: false})
  translated_languages: string[];

}

const SettingSchema = SchemaFactory.createForClass(Setting)

export {SettingSchema}

