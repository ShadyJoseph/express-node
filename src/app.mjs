import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import routes from './routes/index.mjs';
import logRequests from './middlewares/logRequests.mjs';
import errorHandler from './middlewares/errorHandler.mjs';
import sessionService from './services/sessionService.mjs';
import { APP_CONFIG } from './config/config.mjs';
import { logger } from './utils/logger.mjs'; 
import './passport/localStrategy.mjs';
import './passport/discordStrategy.mjs';

const router = express.Router();
const app = express();

mongoose.connect(APP_CONFIG.mongoUrl)
    .then(() => logger.info('Connected to the database')) 
    .catch((err) => {
        logger.error(`Database connection error: ${err.message}`, err);  
        process.exit(1);
    });

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser(APP_CONFIG.cookieSecret));
app.use(sessionService);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('combined'));
app.use(logRequests);

app.use('/api', routes);

app.use(errorHandler);

export default app;
