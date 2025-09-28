import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { GetPaymentMethodsDto } from './dto/get-payment-methods.dto';
import { DefaultCart } from './dto/set-default-card.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodService } from './payment-method.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Cards")
@Controller('cards')
export class PaymentMethodController {
  
  private readonly logger = new Logger();

  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    try {
      
      return this.paymentMethodService.create(createPaymentMethodDto);
    // }else{
    //   throw new HttpException('ID Should not be emapty', HttpStatus.BAD_REQUEST)
  
    // }

    } catch (error) {
      this.logger.error(`cards/create failed: ${error} user is ${createPaymentMethodDto?.owner_name}`)
      throw error
    }

  }

  @Get()
  findAll(@Query() getTaxesDto: GetPaymentMethodsDto) {
    try {
      
      return this.paymentMethodService.findAll();

    } catch (error) {
      this.logger.error(`cards/findAll failed: ${error} `)
      throw error
    }

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      
      return this.paymentMethodService.findOne(id);

    } catch (error) {
      this.logger.error(`cards/findOne failed: ${error} `)
      throw error
    }

  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaxDto: UpdatePaymentMethodDto,
  ) {
    try {
      
      return this.paymentMethodService.update(+id, updateTaxDto);

    } catch (error) {
      this.logger.error(`cards/update failed: ${error} `)
      throw error
    }
  
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
    
      return this.paymentMethodService.remove(id);

    } catch (error) {
      this.logger.error(`cards/update failed: ${error} `)
      throw error
    }

  }
}

@Controller('/save-payment-method')
export class SavePaymentMethodController {

  private readonly logger = new Logger();

  constructor(private readonly paymentMethodService: PaymentMethodService) {}
  @Post()
  savePaymentMethod(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    try {
      
      createPaymentMethodDto.default_card = false;
      return this.paymentMethodService.savePaymentMethod(createPaymentMethodDto);
    } catch (error) {
      this.logger.error(`save-payment-method/savePaymentMethod failed: ${error} `)
      throw error
    }

  }
}

@Controller('/set-default-card')
export class SetDefaultCartController {
  private readonly logger = new Logger();

  constructor(private readonly paymentMethodService: PaymentMethodService) {}
  @Post()
  setDefaultCart(@Body() defaultCart: DefaultCart) {
    try {
      
    
      return this.paymentMethodService.saveDefaultCart(defaultCart);
    } catch (error) {
      this.logger.error(`set-default-card/setDefaultCart failed: ${error} `)
      throw error
    }

  }
}
