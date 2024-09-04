import dotenv from 'dotenv';

dotenv.config();

export const APP_CONFIG = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'defaultSessionSecret',
  cookieSecret: process.env.COOKIE_SECRET || 'defaultCookieSecret',
  sessionMaxAge: process.env.SESSION_MAX_AGE || 1000 * 60 * 60 * 2, // Default: 2 hours
};
