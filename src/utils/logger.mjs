// logger.mjs
export const log = (level, message, error = null) => {
    const logMessage = `[${level.toUpperCase()}] ${message}`;
    if (error) {
        console.error(logMessage, error);
    } else {
        console.log(logMessage);
    }
};

export const logger = {
    info: (message) => log('info', message),
    warn: (message) => log('warn', message),
    error: (message, error) => log('error', message, error),
};
