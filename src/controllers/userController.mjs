import { matchedData } from 'express-validator';
import mockUsers from '../data/mockUsers.mjs'

// Get all users or filtered users
export const getUsers = (req, res) => {
  const { filter, value } = matchedData(req);
  if (!filter || !value) {
    return res.json(mockUsers);
  }
  const filteredUsers = mockUsers.filter(user => user[filter]?.includes(value));
  if (filteredUsers.length === 0) {
    return res.status(400).json({ error: `Invalid filter '${filter}' or no matching users found` });
  }
  res.json(filteredUsers);
};

// Get a specific user by ID
export const getUserById = (req, res) => {
  const user = mockUsers[req.userIndex];
  res.json(user);
};

// Create a new user
export const createUser = (req, res) => {
  const validatedData = matchedData(req);
  const newUser = {
    id: (mockUsers[mockUsers.length - 1]?.id || 0) + 1,
    ...validatedData,
  };
  mockUsers.push(newUser);
  res.status(201).json(newUser);
};

// Update a user completely by ID
export const updateUser = (req, res) => {
  const validatedData = matchedData(req);
  mockUsers[req.userIndex] = { id: req.params.id, ...validatedData };
  res.json(mockUsers[req.userIndex]);
};

// Partially update a user by ID
export const patchUser = (req, res) => {
  const validatedData = matchedData(req);
  const updatedUser = {
    ...mockUsers[req.userIndex],
    ...validatedData,
  };
  mockUsers[req.userIndex] = updatedUser;
  res.json(updatedUser);
};

// Delete a user by ID
export const deleteUser = (req, res) => {
  mockUsers.splice(req.userIndex, 1);
  res.status(204).send();
};
