// Mocking dependencies
jest.mock("express-validator", () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: "Invalid Field" }]),
    })),
    matchedData: jest.fn(() => ({
        username: "test",
        password: "password",
        job: "Developer",
    })),
}));

jest.mock("../mongoose/schemas/localUser.mjs", () => ({
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
}));

jest.mock("../utils/hashingUtils.mjs", () => ({
    hashPassword: jest.fn(password => `hashed_${password}`),
}));

jest.mock("../utils/logger.mjs", () => ({
    logError: jest.fn(),
}));

const mockRequest = {};
const mockResponse = {
    send: jest.fn(),
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
    sendStatus: jest.fn(),
};

// Test for getUsers
import { getUsers } from '../controllers/userController.mjs';
import LocalUser from '../mongoose/schemas/localUser.mjs';

describe('getUsers', () => {
    it('should return users when found', async () => {
        LocalUser.find.mockResolvedValue([{ username: 'test', job: 'Developer' }]);
        const req = { query: {} };
        
        await getUsers(req, mockResponse);

        expect(LocalUser.find).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith([{ username: 'test', job: 'Developer' }]);
    });

    it('should return 500 when an error occurs', async () => {
        LocalUser.find.mockRejectedValue(new Error('Database error'));
        await getUsers(mockRequest, mockResponse);
        
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'An unexpected error occurred' });
    });

    // Additional tests
    it('should handle empty result when no users are found', async () => {
        LocalUser.find.mockResolvedValue([]);
        const req = { query: {} };

        await getUsers(req, mockResponse);

        expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it('should filter users based on query parameters', async () => {
        LocalUser.find.mockResolvedValue([{ username: 'test', job: 'Developer' }]);
        const req = { query: { filter: 'username', value: 'test' } };

        await getUsers(req, mockResponse);

        expect(LocalUser.find).toHaveBeenCalledWith({ username: { $regex: 'test', $options: 'i' } });
        expect(mockResponse.json).toHaveBeenCalledWith([{ username: 'test', job: 'Developer' }]);
    });
});

// Test for getUserById
import { getUserById } from '../controllers/userController.mjs';

describe('getUserById', () => {
    it('should return user by ID when found', async () => {
        LocalUser.findById.mockResolvedValue({ username: 'test', job: 'Developer' });
        const req = { params: { id: 'validMongoId' } };
        
        await getUserById(req, mockResponse);

        expect(LocalUser.findById).toHaveBeenCalledWith('validMongoId');
        expect(mockResponse.json).toHaveBeenCalledWith({ username: 'test', job: 'Developer' });
    });

    it('should return 400 when invalid ID is provided', async () => {
        const req = { params: { id: 'invalidId' } };
        await getUserById(req, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid user ID' });
    });

    it('should return 404 if user is not found', async () => {
        LocalUser.findById.mockResolvedValue(null);
        const req = { params: { id: 'validMongoId' } };

        await getUserById(req, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Resource not found' });
    });
});

// Test for createUser
import { createUser } from '../controllers/userController.mjs';

describe('createUser', () => {
    it('should create user and return 201', async () => {
        const req = { body: { username: 'test', password: 'password', job: 'Developer' } };
        const mockUser = { save: jest.fn().mockResolvedValueOnce({ _id: '123', username: 'test', job: 'Developer' }) };
        jest.spyOn(LocalUser.prototype, 'save').mockReturnValue(mockUser.save);

        await createUser(req, mockResponse);

        expect(LocalUser.prototype.save).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            id: '123',
            username: 'test',
            job: 'Developer',
        });
    });

    it('should return 500 if an error occurs during creation', async () => {
        LocalUser.prototype.save.mockRejectedValueOnce(new Error('Database error'));
        await createUser(mockRequest, mockResponse);
        
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'An unexpected error occurred' });
    });

    it('should handle validation errors', async () => {
        jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => false),
            array: jest.fn(() => [{ msg: "Invalid Field" }]),
        }));

        await createUser(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith([{ msg: "Invalid Field" }]);
    });
});

// Test for updateUser
import { updateUser } from '../controllers/userController.mjs';

describe('updateUser', () => {
    it('should update user and return the updated user', async () => {
        const req = { params: { id: '123' }, body: { job: 'Senior Developer' } };
        LocalUser.findByIdAndUpdate.mockResolvedValueOnce({ username: 'test', job: 'Senior Developer' });

        await updateUser(req, mockResponse);

        expect(LocalUser.findByIdAndUpdate).toHaveBeenCalledWith('123', { job: 'Senior Developer' }, { new: true, runValidators: true });
        expect(mockResponse.json).toHaveBeenCalledWith({ username: 'test', job: 'Senior Developer' });
    });

    it('should return 500 if there is a database error', async () => {
        LocalUser.findByIdAndUpdate.mockRejectedValueOnce(new Error('Database error'));

        await updateUser(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'An unexpected error occurred' });
    });

    it('should handle validation errors', async () => {
        jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => false),
            array: jest.fn(() => [{ msg: "Invalid Field" }]),
        }));

        await updateUser(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith([{ msg: "Invalid Field" }]);
    });

    it('should handle case where user does not exist', async () => {
        LocalUser.findByIdAndUpdate.mockResolvedValueOnce(null);
        const req = { params: { id: '123' }, body: { job: 'Senior Developer' } };

        await updateUser(req, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
});

// Test for deleteUser
import { deleteUser } from '../controllers/userController.mjs';

describe('deleteUser', () => {
    it('should delete user and return 204', async () => {
        const req = { params: { id: '123' } };
        LocalUser.findByIdAndDelete.mockResolvedValueOnce({ _id: '123' });

        await deleteUser(req, mockResponse);

        expect(LocalUser.findByIdAndDelete).toHaveBeenCalledWith('123');
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should return 500 if an error occurs during deletion', async () => {
        LocalUser.findByIdAndDelete.mockRejectedValueOnce(new Error('Database error'));

        await deleteUser(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'An unexpected error occurred' });
    });

    it('should return 404 if user to delete is not found', async () => {
        LocalUser.findByIdAndDelete.mockResolvedValueOnce(null);
        const req = { params: { id: '123' } };

        await deleteUser(req, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
});
