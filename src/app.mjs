import express from 'express';
import routes from './routes/index.mjs';
import logRequests from './middlewares/logRequests.mjs';
import errorHandler from './middlewares/errorHandler.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'shadyJ';

app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use(session({}))
app.use(logRequests);

app.use('/api', routes);

app.use(errorHandler);

export default app;
