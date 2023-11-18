// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()


// env.ts
export default () => ({
  // Add your own properties here however you'd like
  // port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.MONGODB_URI,
    port: process.env.MONGODB_PORT,
    url: process.env.MONGODBURL
  },
  redis: {
    host: process.env.REDIS_URI ,
    port: process.env.REDIS_PORT 
  },
  mailer: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
    transport: process.env.MAIL_TRANSPORT
  },
  otp: {
    OTP_URL : process.env.OTP_URL,
    OTP_ApiKey: process.env.OTP_ApiKey,
    OTP_ClientId: process.env.OTP_ClientId,
    OTP_SenderID: process.env.OTP_SenderID,
  }
});


