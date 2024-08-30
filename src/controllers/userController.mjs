import { matchedData } from 'express-validator';
import mockUsers from '../data/mockUsers.mjs';

export const getUsers = (req, res) => {
  const apiToken = req.signedCookies.API_TOKEN;

  if (!apiToken || apiToken !== "hello") {
    return res.status(403).json({ error: "Access denied: Invalid or missing API token." });
  }

  const { filter, value } = matchedData(req);

  if (!filter || !value) {
    return res.json({ users: mockUsers, token: apiToken });
  }

  const filteredUsers = mockUsers.filter(user => user[filter]?.includes(value));

  if (filteredUsers.length === 0) {
    return res.status(400).json({ error: `No users found matching filter '${filter}'` });
  }

  res.json({ users: filteredUsers, token: apiToken });
};

export const getUserById = (req, res) => {
  const user = mockUsers[req.userIndex];
  res.json(user);
};

export const createUser = (req, res) => {
  const validatedData = matchedData(req);
  const newUser = {
    id: (mockUsers[mockUsers.length - 1]?.id || 0) + 1,
    ...validatedData,
  };
  mockUsers.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
  const validatedData = matchedData(req);
  mockUsers[req.userIndex] = { id: req.params.id, ...validatedData };
  res.json(mockUsers[req.userIndex]);
};

export const patchUser = (req, res) => {
  const validatedData = matchedData(req);
  const updatedUser = { ...mockUsers[req.userIndex], ...validatedData };
  mockUsers[req.userIndex] = updatedUser;
  res.json(updatedUser);
};

export const deleteUser = (req, res) => {
  mockUsers.splice(req.userIndex, 1);
  res.status(204).send();
};
