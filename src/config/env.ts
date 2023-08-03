require('dotenv').config()


// env.ts
export default () => ({
  // Add your own properties here however you'd like
  // port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.MONGODB_URI || 'mongodb://127.0.0.1',
    port: process.env.MONGODB_PORT || 27017
  }, 
  redis: {
    host: process.env.REDIS_URI || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },
  mailer : {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
    transport: process.env.MAIL_TRANSPORT
  }
});