import { matchedData } from 'express-validator';
import { handleError } from '../utils/responseHandlers.mjs';
import { logger } from '../utils/logger.mjs';
import LocalUser from '../mongoose/schemas/localUser.mjs';
import mongoose from 'mongoose';
import { hashPassword } from '../utils/hashingUtils.mjs';
import { MESSAGES, STATUS_CODES } from '../config/config.mjs';

// Utility to handle database operations
const handleDatabaseOperation = async (operation, res, options = {}) => {
    const {
        successStatus = STATUS_CODES.success, 
        notFoundStatus = STATUS_CODES.notFound, 
        notFoundMessage = MESSAGES.userNotFound,
        successMessage = null,
    } = options;

    try {
        const result = await operation();
        if (!result && notFoundStatus) {
            return handleError(res, notFoundStatus, notFoundMessage);
        }
        return res.status(successStatus).json(successMessage ? { message: successMessage, result } : result);
    } catch (error) {
        logger.error(MESSAGES.unexpectedError, error);
        const errorMessage = error.code === 11000 ? MESSAGES.duplicateKeyError : MESSAGES.unexpectedError;
        handleError(res, STATUS_CODES.serverError, errorMessage);
    }
};

// Helper to validate and hash passwords
const validateAndHashPassword = async (data) => {
    if (data.password) {
        data.password = await hashPassword(data.password);
    }
    return data;
};

// Get users with optional filters
export const getUsers = async (req, res) => {
    const { filter, value } = matchedData(req);

    const operation = () => {
        const query = filter && value ? { [filter]: { $regex: value, $options: 'i' } } : {};
        return LocalUser.find(query).lean().exec();
    };

    await handleDatabaseOperation(operation, res);
};

// Get user by ID
export const getUserById = async (req, res) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return handleError(res, STATUS_CODES.badRequest, MESSAGES.invalidUserId);
    }

    const operation = () => LocalUser.findById(userId).lean().exec();
    await handleDatabaseOperation(operation, res);
};

// Create new user
export const createUser = async (req, res) => {
    const validatedData = await validateAndHashPassword(matchedData(req));

    const operation = () => new LocalUser(validatedData).save();
    await handleDatabaseOperation(operation, res, {
        successStatus: STATUS_CODES.created,
        successMessage: MESSAGES.userCreated,
    });
};

// Update user by replacing fields (PUT)
export const updateUser = async (req, res) => {
    const validatedData = await validateAndHashPassword(matchedData(req));

    const operation = () => LocalUser.findByIdAndUpdate(
        req.params.id,
        validatedData,
        { new: true, runValidators: true }
    ).lean().exec();

    await handleDatabaseOperation(operation, res, { successMessage: MESSAGES.userUpdated });
};

// Update user with partial fields (PATCH)
export const patchUser = async (req, res) => {
    const validatedData = await validateAndHashPassword(matchedData(req));

    const operation = () => LocalUser.findByIdAndUpdate(
        req.params.id,
        { $set: validatedData },
        { new: true, runValidators: true }
    ).lean().exec();

    await handleDatabaseOperation(operation, res, { successMessage: MESSAGES.userUpdated });
};

// Delete user
export const deleteUser = async (req, res) => {
    const operation = () => LocalUser.findByIdAndDelete(req.params.id).lean().exec();
    await handleDatabaseOperation(operation, res, { successStatus: STATUS_CODES.noContent });
};
