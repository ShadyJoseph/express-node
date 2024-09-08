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
import './strategies/localStrategy.mjs';

// Initialize Express app
const app = express();

// MongoDB connection
mongoose.connect(APP_CONFIG.mongoUrl)
    .then(() => console.log('Connected to the database'))
    .catch((err) => {
        console.error(`Database connection error: ${err.message}`);
        process.exit(1);
    });

// Mongoose connection events
mongoose.connection.on('error', (err) => console.error(`Mongoose connection error: ${err}`));
mongoose.connection.on('connected', () => console.log('Mongoose connected to the database'));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected from the database'));

// Middleware setup
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser(APP_CONFIG.cookieSecret)); // Cookie parser
app.use(sessionService); // Session management
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Passport session management
app.use(morgan('combined')); // HTTP request logger
app.use(logRequests); // Custom request logging

// Route handling
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app;
