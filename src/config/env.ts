require('dotenv').config()


// env.ts
export default () => ({
  // Add your own properties here however you'd like
  // port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.MONGODB_URI || 'mongodb://127.0.0.1',
    port: process.env.MONGODB_PORT || 27017
  }, 
  redis: {
    host: process.env.REDIS_URI || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },
  mailer : {
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_FROM: process.env.MAIL_FROM
  }
});