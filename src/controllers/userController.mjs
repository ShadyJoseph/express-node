import { matchedData } from 'express-validator';
import { handleError } from '../utils/responseHandlers.mjs';
import { logError } from '../utils/logger.mjs';
import User from '../mongoose/schemas/user.mjs';
import mongoose from 'mongoose';
import { hashPassword } from '../utils/hashingUtils.mjs';

const handleDatabaseOperation = async (operation, res, successStatus = 200) => {
    try {
        const result = await operation();
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
        return User.find(query).lean().exec();
    };

    handleDatabaseOperation(operation, res);
};

export const getUserById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return handleError(res, 400, "Invalid user ID");
    }

    const operation = () => User.findById(req.params.id).lean().exec();
    handleDatabaseOperation(operation, res);
};

export const createUser = async (req, res) => {
    const validatedData = matchedData(req);

    try {
        validatedData.password = await hashPassword(validatedData.password);
        const newUser = new User(validatedData);
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

    const operation = () => User.findByIdAndUpdate(
        req.params.id,
        validatedData,
        { new: true, runValidators: true }
    ).lean().exec();

    handleDatabaseOperation(operation, res);
};

export const patchUser = async (req, res) => {
    const validatedData = matchedData(req);

    if (validatedData.password) {
        validatedData.password = await hashPassword(validatedData.password);
    }

    const operation = () => User.findByIdAndUpdate(
        req.params.id,
        { $set: validatedData },
        { new: true, runValidators: true }
    ).lean().exec();

    handleDatabaseOperation(operation, res);
};

export const deleteUser = async (req, res) => {
    const operation = () => User.findByIdAndDelete(req.params.id).lean().exec();
    
    try {
        const deletedUser = await operation();
        if (!deletedUser) {
            return handleError(res, 404, "User not found");
        }
        res.status(204).send();
    } catch (error) {
        logError('Error in deleteUser', error);
        handleError(res, 500, "An unexpected error occurred");
    }
};
