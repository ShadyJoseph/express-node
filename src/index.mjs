import express from "express";
import { validationResult, matchedData } from "express-validator";
import { checkSchema } from 'express-validator';
import dotenv from "dotenv";
import { mockUsers } from "./DB.js";
import {
    userIdSchema,
    userFiltersSchema,
    createUserSchema,
    updateUserSchema,
    patchUserSchema
} from "./utils/validationSchemas.js";

dotenv.config();

const app = express();
app.use(express.json());

// Status Codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    NO_CONTENT: 204,
    INTERNAL_SERVER_ERROR: 500,
};

// Middleware for logging requests
const logRequests = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
};
app.use(logRequests);

// Middleware for handling validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errorMessages });
    }
    next();
};

// Middleware to resolve user by ID
const validateUserId = [
    checkSchema(userIdSchema),
    validateRequest,
    (req, res, next) => {
        const userId = req.params.id;
        const userIndex = mockUsers.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: `User with ID ${userId} not found` });
        }
        req.userIndex = userIndex;
        next();
    }
];

// Routes

// Home route
app.get("/", (req, res) => res.status(HTTP_STATUS.OK).json({ message: "Welcome to the API" }));

// Get all users or filtered users
app.get("/api/users", [
    checkSchema(userFiltersSchema),
    validateRequest,
], (req, res) => {
    const { filter, value } = matchedData(req);
    if (!filter || !value) {
        return res.status(HTTP_STATUS.OK).json(mockUsers);
    }
    if (filter && mockUsers[0].hasOwnProperty(filter)) {
        const filteredUsers = mockUsers.filter(user => user[filter].includes(value));
        return res.status(HTTP_STATUS.OK).json(filteredUsers);
    }
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: `Invalid filter '${filter}' or no matching users found` });
});

// Create a new user
app.post("/api/users", [
    checkSchema(createUserSchema),
    validateRequest,
], (req, res) => {
    const validatedData = matchedData(req);
    const newUser = {
        id: (mockUsers[mockUsers.length - 1]?.id || 0) + 1,
        ...validatedData,
    };
    mockUsers.push(newUser);
    return res.status(HTTP_STATUS.CREATED).json(newUser);
});

// Get a specific user by ID
app.get("/api/users/:id", validateUserId, (req, res) => {
    const user = mockUsers[req.userIndex];
    return res.status(HTTP_STATUS.OK).json(user);
});

// Update a user completely by ID
app.put("/api/users/:id", [
    validateUserId,
    checkSchema(updateUserSchema),
    validateRequest,
], (req, res) => {
    const validatedData = matchedData(req);
    mockUsers[req.userIndex] = { id: req.params.id, ...validatedData };
    return res.status(HTTP_STATUS.OK).json(mockUsers[req.userIndex]);
});

// Partially update a user by ID
app.patch("/api/users/:id", [
    validateUserId,
    checkSchema(patchUserSchema),
    validateRequest,
], (req, res) => {
    const validatedData = matchedData(req);
    const updatedUser = {
        ...mockUsers[req.userIndex],
        ...validatedData,
    };
    mockUsers[req.userIndex] = updatedUser;
    return res.status(HTTP_STATUS.OK).json(updatedUser);
});

// Delete a user by ID
app.delete("/api/users/:id", validateUserId, (req, res) => {
    mockUsers.splice(req.userIndex, 1);
    return res.status(HTTP_STATUS.NO_CONTENT).send();
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'An unexpected error occurred!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
