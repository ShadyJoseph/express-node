import express from 'express';
import routes from './routes/index.mjs';
import logRequests from './middlewares/logRequests.mjs';
import errorHandler from './middlewares/errorHandler.mjs';

const app = express();

app.use(express.json());
app.use(logRequests);

// Register all routes
app.use('/api', routes);

// Global error handler
app.use(errorHandler);

export default app;
