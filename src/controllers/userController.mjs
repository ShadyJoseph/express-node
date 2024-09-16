import { matchedData } from 'express-validator';
import { handleError } from '../utils/responseHandlers.mjs';
import { logError } from '../utils/logger.mjs';
import LocalUser from '../mongoose/schemas/localUser.mjs';
import mongoose from 'mongoose';
import { hashPassword } from '../utils/hashingUtils.mjs';
import { MESSAGES, STATUS_CODES } from '../config/config.mjs';

// Utility to handle database operations with enhanced granularity
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
        if (error.code === 11000) {
            return handleError(res, STATUS_CODES.badRequest, MESSAGES.duplicateKeyError);
        }
        logError(MESSAGES.unexpectedError, error);
        handleError(res, STATUS_CODES.serverError, MESSAGES.unexpectedError);
    }
};

export const getUsers = async (req, res) => {
    const { filter, value } = matchedData(req);

    const operation = () => {
        const query = filter && value ? { [filter]: { $regex: value, $options: 'i' } } : {};
        return LocalUser.find(query).lean().exec();
    };

    await handleDatabaseOperation(operation, res);
};

export const getUserById = async (req, res) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return handleError(res, STATUS_CODES.badRequest, MESSAGES.invalidUserId);
    }

    const operation = () => LocalUser.findById(userId).lean().exec();
    await handleDatabaseOperation(operation, res, {
        notFoundMessage: MESSAGES.userNotFound
    });
};

export const createUser = async (req, res) => {
    const validatedData = matchedData(req);

    try {
        if (validatedData.password) {
            validatedData.password = await hashPassword(validatedData.password);
        }

        const newUser = new LocalUser(validatedData);
        await newUser.save();

        res.status(STATUS_CODES.created).json({
            message: MESSAGES.userCreated,
            user: { id: newUser._id, username: newUser.username, job: newUser.job }
        });
    } catch (error) {
        logError(MESSAGES.unexpectedError, error);
        handleError(res, STATUS_CODES.serverError, MESSAGES.unexpectedError);
    }
};

export const updateUser = async (req, res) => {
    const validatedData = matchedData(req);

    if (validatedData.password) {
        validatedData.password = await hashPassword(validatedData.password);
    }

    const operation = () => LocalUser.findByIdAndUpdate(
        req.params.id,
        validatedData,
        { new: true, runValidators: true }
    ).lean().exec();

    await handleDatabaseOperation(operation, res, {
        successMessage: MESSAGES.userUpdated,
        notFoundMessage: MESSAGES.userNotFound
    });
};

export const patchUser = async (req, res) => {
    const validatedData = matchedData(req);

    if (validatedData.password) {
        validatedData.password = await hashPassword(validatedData.password);
    }

    const updateData = Object.keys(validatedData).reduce((acc, key) => {
        if (validatedData[key] !== undefined) {
            acc[key] = validatedData[key];
        }
        return acc;
    }, {});

    const operation = () => LocalUser.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).lean().exec();

    await handleDatabaseOperation(operation, res, {
        successMessage: MESSAGES.userUpdated,
        notFoundMessage: MESSAGES.userNotFound
    });
};

export const deleteUser = async (req, res) => {
    const operation = () => LocalUser.findByIdAndDelete(req.params.id).lean().exec();

    await handleDatabaseOperation(operation, res, {
        successStatus: STATUS_CODES.noContent,
        notFoundMessage: MESSAGES.userNotFound
    });
};
