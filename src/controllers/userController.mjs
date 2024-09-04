// src/controllers/userController.mjs
import { matchedData } from 'express-validator';
import { handleError } from '../utils/responseHandlers.mjs';
import { logError } from '../utils/logger.mjs';
import User from '../mongoose/schemas/user.mjs';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export const getUsers = async (req, res) => {
    try {
        req.session.visited = true;

        const apiToken = req.signedCookies.API_TOKEN;
        if (!apiToken || apiToken !== "hello") {
            return handleError(res, 403, "Access denied: Invalid or missing API token.");
        }

        const { filter, value } = matchedData(req);

        let users;
        if (filter && value) {
            const query = {};
            query[filter] = { $regex: value, $options: 'i' }; 
            users = await User.find(query).lean().exec(); 
        } else {
            users = await User.find({}).lean().exec(); 
        }

        res.json({ users, token: apiToken });
    } catch (error) {
        logError('Error in getUsers', error);
        handleError(res, 500, "An unexpected error occurred");
    }
};

export const getUserById = async (req, res) => {
    try {
        // Validate if id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return handleError(res, 400, "Invalid user ID");
        }

        const user = await User.findById(req.params.id).lean().exec();
        if (!user) {
            return handleError(res, 404, "User not found");
        }
        res.json(user);
    } catch (error) {
        logError('Error in getUserById', error);
        handleError(res, 500, "An unexpected error occurred");
    }
};

export const createUser = async (req, res) => {
    try {
        const validatedData = matchedData(req);

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        const newUser = new User({ ...validatedData, password: hashedPassword });

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
    try {
        const validatedData = matchedData(req);

        // Hash the password if it’s being updated
        if (validatedData.password) {
            validatedData.password = await bcrypt.hash(validatedData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            validatedData, 
            { new: true, runValidators: true }
        ).lean().exec();

        if (!updatedUser) {
            return handleError(res, 404, "User not found");
        }
        res.json(updatedUser);
    } catch (error) {
        logError('Error in updateUser', error);
        handleError(res, 500, "An unexpected error occurred");
    }
};

export const patchUser = async (req, res) => {
    try {
        const validatedData = matchedData(req);

        // Hash the password if it’s being patched
        if (validatedData.password) {
            validatedData.password = await bcrypt.hash(validatedData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: validatedData }, 
            { new: true, runValidators: true }
        ).lean().exec();

        if (!updatedUser) {
            return handleError(res, 404, "User not found");
        }
        res.json(updatedUser);
    } catch (error) {
        logError('Error in patchUser', error);
        handleError(res, 500, "An unexpected error occurred");
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id).lean().exec();
        if (!deletedUser) {
            return handleError(res, 404, "User not found");
        }
        res.status(204).send();
    } catch (error) {
        logError('Error in deleteUser', error);
        handleError(res, 500, "An unexpected error occurred");
    }
};
