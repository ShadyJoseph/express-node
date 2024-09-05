import express from 'express';
import routes from './routes/index.mjs';
import logRequests from './middlewares/logRequests.mjs';
import errorHandler from './middlewares/errorHandler.mjs';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import sessionService from './services/sessionService.mjs';
import { APP_CONFIG } from './config/config.mjs';
import passport from 'passport';
import mongoose from 'mongoose';
import './strategies/localStrategy.mjs';

const app = express();

mongoose.connect('mongodb://localhost/express-node')
    .then(() => console.log('Connected to the database'))
    .catch((err) => {
        console.error(`Database connection error: ${err.message}`);
        process.exit(1);
    });

mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to the database');
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from the database');
});

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser(APP_CONFIG.cookieSecret));
app.use(sessionService); // Ensure this uses valid configuration
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('combined'));
app.use(logRequests);

app.use('/api', routes);
app.use(errorHandler);

export default app;
