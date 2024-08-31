import app from './app.mjs';
import { APP_CONFIG } from './config/config.mjs';

app.listen(APP_CONFIG.port, () => {
  console.log(`Server is running on port ${APP_CONFIG.port}`);
});
