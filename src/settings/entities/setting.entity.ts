import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';



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

@Schema({timestamps: true})
export class Setting extends CoreEntity {

  @Prop({type: SettingsOptions, required: false})
  options: SettingsOptions;

  @Prop({type: String, required: false})
  language: string;

  @Prop({type: [String], required: false})
  translated_languages: string[];

}

const SettingSchema = SchemaFactory.createForClass(Setting)

export {SettingSchema}

