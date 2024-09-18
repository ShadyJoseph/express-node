import app from './app.mjs';
import { APP_CONFIG } from './config/config.mjs';
import { logger } from './utils/logger.mjs';

app.listen(APP_CONFIG.port, () => {
  logger.info(`Server is running on port ${APP_CONFIG.port}`);
});
