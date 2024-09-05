import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};
