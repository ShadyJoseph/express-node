import session from 'express-session';
import MongoStore from 'connect-mongo';
import { APP_CONFIG } from '../config/config.mjs';

const sessionStore = MongoStore.create({
    mongoUrl: APP_CONFIG.mongoUrl,
    collectionName: 'sessions',
    ttl: APP_CONFIG.sessionMaxAge / 1000,
    autoRemove: 'native',
});

const sessionOptions = {
    secret: APP_CONFIG.sessionSecret,
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: APP_CONFIG.env === 'production',
        sameSite: 'strict',
        maxAge: APP_CONFIG.sessionMaxAge,
    }
};

export default session(sessionOptions);
