import dotenv from 'dotenv';

dotenv.config();

export const APP_CONFIG = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'anotherSecret',
  cookieSecret: process.env.COOKIE_SECRET || 'defaultSecret',
};
