import session from 'express-session';
import { APP_CONFIG } from '../config/config.mjs';

const sessionService = session({
  secret: APP_CONFIG.sessionSecret,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    secure: APP_CONFIG.env === 'production',
    httpOnly: true,
  },
});

export default sessionService;
