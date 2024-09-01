import { matchedData } from 'express-validator';
import mockUsers from '../data/mockUsers.mjs';
import { handleError } from '../utils/responseHandlers.mjs';

export const authUser = async (req, res) => {
  try {
    const { username, password } = matchedData(req);
    const user = mockUsers.find(user => user.username === username);

    if (!user || user.password !== password) {
      return handleError(res, 401, 'BAD CREDENTIALS');
    }

    req.session.user = { id: user.id, username: user.username, job: user.job };
    req.session.visited = true;

    return res.status(200).json({ message: 'Authentication successful', user: req.session.user });
  } catch (error) {
    console.error('Error in authUser:', error);
    handleError(res, 500, 'An unexpected error occurred');
  }
};

export const authState = async (req, res) => {
  req.sessionStore.get(req.sessionID,(err,session)=>{
    console.log(session)
  })
  req.session.user
    ? res.status(200).json(req.session.user)
    : handleError(res, 401, 'NOT AUTHENTICATED');
};
