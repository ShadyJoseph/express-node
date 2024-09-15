import { matchedData } from 'express-validator';
import { handleError } from '../utils/responseHandlers.mjs';
import { logError } from '../utils/logger.mjs';
import LocalUser from '../mongoose/schemas/localUser.mjs';
import mongoose from 'mongoose';
import { hashPassword } from '../utils/hashingUtils.mjs';

// Utility to handle database operations
const handleDatabaseOperation = async (operation, res, successStatus = 200, notFoundStatus = 404) => {
    try {
        const result = await operation();
        if (!result && notFoundStatus) {
            return handleError(res, notFoundStatus, "Resource not found");
        }
        res.status(successStatus).json(result);
    } catch (error) {
        logError('Database operation error', error);
        handleError(res, 500, "An unexpected error occurred");
    }
};

export const getUsers = async (req, res) => {
    const { filter, value } = matchedData(req);

    const operation = () => {
        const query = filter && value ? { [filter]: { $regex: value, $options: 'i' } } : {};
        return LocalUser.find(query).lean().exec();
    };

    handleDatabaseOperation(operation, res);
};

export const getUserById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return handleError(res, 400, "Invalid user ID");
    }

    const operation = () => LocalUser.findById(req.params.id).lean().exec();
    handleDatabaseOperation(operation, res, 200, 404);
};

export const createUser = async (req, res) => {
    const validatedData = matchedData(req);

    try {
        validatedData.password = await hashPassword(validatedData.password);
        const newUser = new LocalUser(validatedData);
        await newUser.save();
        res.status(201).json({
            id: newUser._id,
            username: newUser.username,
            job: newUser.job
        });
    } catch (error) {
        logError('Error in createUser', error);
        handleError(res, 500, "An unexpected error occurred");
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

    handleDatabaseOperation(operation, res, 200, 404);
};

export const patchUser = async (req, res) => {
    const validatedData = matchedData(req);

    if (validatedData.password) {
        validatedData.password = await hashPassword(validatedData.password);
    }

    const operation = () => LocalUser.findByIdAndUpdate(
        req.params.id,
        { $set: validatedData },
        { new: true, runValidators: true }
    ).lean().exec();

    handleDatabaseOperation(operation, res, 200, 404);
};

export const deleteUser = async (req, res) => {
    const operation = () => LocalUser.findByIdAndDelete(req.params.id).lean().exec();
    
    handleDatabaseOperation(operation, res, 204, 404);
};
