// utils/logger.mjs
export const logError = (message, error) => {
    console.error(`[ERROR] ${message}:`, error);
};

export const logInfo = (message, data = null) => {
    console.info(`[INFO] ${message}`, data);
};
