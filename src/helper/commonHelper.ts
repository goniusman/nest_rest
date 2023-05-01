export class CommonHelper{

  respone (status: boolean, message: string, data: any = {} ): object {

    return {
      status: status,
      message: message,
      data: data
    }

  }


}


