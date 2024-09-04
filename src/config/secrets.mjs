import dotenv from 'dotenv';

dotenv.config();

export const SECRETS = {
  sessionSecret: process.env.SESSION_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
};
