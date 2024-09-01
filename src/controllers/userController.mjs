// src/controllers/userController.mjs
import { matchedData } from 'express-validator';
import mockUsers from '../data/mockUsers.mjs';
import { handleError } from '../utils/responseHandlers.mjs';

// Utility function to validate user index
const validateUserIndex = (req, res) => {
  if (req.userIndex < 0 || req.userIndex >= mockUsers.length) {
    return handleError(res, 404, "User not found");
  }
  return null;
};

export const getUsers = async (req, res) => {
  try {
    req.session.visited = true;

    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        console.error('Error fetching session data:', err);
      } else {
        console.log('Session data:', sessionData);
      }
    });

    const apiToken = req.signedCookies.API_TOKEN;
    if (!apiToken || apiToken !== "hello") {
      return handleError(res, 403, "Access denied: Invalid or missing API token.");
    }

    const { filter, value } = matchedData(req);
    if (!filter || !value) {
      return res.json({ users: mockUsers, token: apiToken });
    }

    if (!mockUsers.some(user => filter in user)) {
      return handleError(res, 400, `Invalid filter '${filter}'`);
    }

    const filteredUsers = mockUsers.filter(user => user[filter]?.includes(value));

    if (filteredUsers.length === 0) {
      return handleError(res, 400, `No users found matching filter '${filter}'`);
    }

    res.json({ users: filteredUsers, token: apiToken });
  } catch (error) {
    console.error('Error in getUsers:', error); // Logging the error
    handleError(res, 500, "An unexpected error occurred");
  }
};

export const getUserById = async (req, res) => {
  try {
    if (validateUserIndex(req, res)) return;

    const user = mockUsers[req.userIndex];
    res.json(user);
  } catch (error) {
    console.error('Error in getUserById:', error); // Logging the error
    handleError(res, 500, "An unexpected error occurred");
  }
};

export const createUser = async (req, res) => {
  try {
    const validatedData = matchedData(req);
    const newUser = {
      id: (mockUsers[mockUsers.length - 1]?.id || 0) + 1,
      ...validatedData,
    };
    mockUsers.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in createUser:', error); // Logging the error
    handleError(res, 500, "An unexpected error occurred");
  }
};

export const updateUser = async (req, res) => {
  try {
    if (validateUserIndex(req, res)) return;

    const validatedData = matchedData(req);
    mockUsers[req.userIndex] = { id: req.params.id, ...validatedData };
    res.json(mockUsers[req.userIndex]);
  } catch (error) {
    console.error('Error in updateUser:', error); // Logging the error
    handleError(res, 500, "An unexpected error occurred");
  }
};

export const patchUser = async (req, res) => {
  try {
    if (validateUserIndex(req, res)) return;

    const validatedData = matchedData(req);
    const updatedUser = { ...mockUsers[req.userIndex], ...validatedData };
    mockUsers[req.userIndex] = updatedUser;
    res.json(updatedUser);
  } catch (error) {
    console.error('Error in patchUser:', error); // Logging the error
    handleError(res, 500, "An unexpected error occurred");
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (validateUserIndex(req, res)) return;

    mockUsers.splice(req.userIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteUser:', error); // Logging the error
    handleError(res, 500, "An unexpected error occurred");
  }
};
