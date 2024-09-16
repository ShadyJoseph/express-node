import dotenv from 'dotenv';

dotenv.config();

export const APP_CONFIG = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    sessionSecret: process.env.SESSION_SECRET || 'defaultSessionSecret',
    cookieSecret: process.env.COOKIE_SECRET || 'defaultCookieSecret',
    sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE, 10) || 1000 * 60 * 60 * 2, // 2 hours
    jwtSecret: process.env.JWT_SECRET || 'defaultJwtSecret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'defaultJwtRefreshSecret',
    mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/express-node',
    discordClientId: process.env.DISCORD_CLIENT_ID || '',
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET || '',
};

export const REDIRECT_URLS = {
    successRedirect: '/api',
    failureRedirect: '/login',
};

export const MESSAGES = {
    authSuccess: 'Authenticated successfully',
    invalidCredentials: 'Invalid credentials',
    notLoggedIn: 'You are not logged in',
    logoutSuccess: 'Logged out successfully',
    userCreated: 'User created successfully',
    userUpdated: 'User updated successfully',
    userNotFound: 'User not found',
    duplicateKeyError: 'Duplicate key error',
    unexpectedError: 'An unexpected error occurred',
    invalidUserId: 'Invalid user ID',
    noTokensProvided: 'No tokens provided',
    invalidToken: 'Invalid token',
};

export const STATUS_CODES = {
    success: 200,
    created: 201,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    notFound: 404,
    serverError: 500,
};
