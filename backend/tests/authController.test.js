import { jest } from '@jest/globals';

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (body = {}, params = {}, query = {}, user = {}) => ({
    body,
    params,
    query,
    user
});

const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockFind = jest.fn();
const mockSelect = jest.fn();

const MockUser = jest.fn().mockImplementation((data) => {
    return {
        ...data,
        _id: 'new_user_id',
        save: mockSave
    };
});
MockUser.findOne = mockFindOne;
MockUser.find = mockFind;

mockFind.mockReturnValue({
    select: mockSelect
});

jest.unstable_mockModule('../models/User.js', () => ({
    default: MockUser
}));

jest.unstable_mockModule('bcryptjs', () => ({
    default: {
        hash: jest.fn().mockResolvedValue('hashed_secret_password'),
        compare: jest.fn().mockResolvedValue(true) 
    }
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        sign: jest.fn().mockReturnValue('fake_jwt_token')
    }
}));


const { register, login, getDrivers } = await import('../controllers/authController.js');

describe('Auth Controller Integration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {

        test('Should create a new user successfully (201)', async () => {
    
            mockFindOne.mockResolvedValue(null);

            const req = mockRequest({
                email: 'new@test.com',
                password: 'password123',
                name: 'New Driver',
                role: 'driver'
            });
            const res = mockResponse();

            await register(req, res);

            expect(mockFindOne).toHaveBeenCalledWith({ email: 'new@test.com' });
            expect(MockUser).toHaveBeenCalledWith(expect.objectContaining({
                email: 'new@test.com',
                password: 'hashed_secret_password', 
                role: 'driver'
            }));
            expect(mockSave).toHaveBeenCalled(); 
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                token: 'fake_jwt_token',
                message: 'User created successfully'
            }));
        });

        test('Should fail if user already exists (400)', async () => {
    
            mockFindOne.mockResolvedValue({ email: 'existing@test.com' });

            const req = mockRequest({
                email: 'existing@test.com',
                password: 'password123'
            });
            const res = mockResponse();

            await register(req, res);

            expect(mockSave).not.toHaveBeenCalled(); 
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
        });

        test('Should handle server errors gracefully (500)', async () => {
          
            mockFindOne.mockRejectedValue(new Error('Database connection failed'));

            const req = mockRequest({ email: 'error@test.com' });
            const res = mockResponse();

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database connection failed' });
        });
    });

    describe('login', () => {

        test('Should login successfully with correct credentials (200)', async () => {
            const fakeUser = {
                _id: 'user_123',
                email: 'valid@test.com',
                password: 'hashed_real_password',
                role: 'driver',
                name: 'Valid User'
            };
            mockFindOne.mockResolvedValue(fakeUser);

            const req = mockRequest({
                email: 'valid@test.com',
                password: 'correct_password'
            });
            const res = mockResponse();

            await login(req, res);

            expect(mockFindOne).toHaveBeenCalledWith({ email: 'valid@test.com' });
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Login successful',
                token: 'fake_jwt_token',
                user: expect.objectContaining({ email: 'valid@test.com' })
            }));
        });

        test('Should fail if user not found (400)', async () => {

            mockFindOne.mockResolvedValue(null);

            const req = mockRequest({ email: 'unknown@test.com', password: '123' });
            const res = mockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
        });

        test('Should fail if password incorrect (400)', async () => {
            
            const fakeUser = { email: 'valid@test.com', password: 'hashed' };
            mockFindOne.mockResolvedValue(fakeUser);

            const bcrypt = await import('bcryptjs');
            bcrypt.default.compare.mockResolvedValueOnce(false);

            const req = mockRequest({ email: 'valid@test.com', password: 'wrong' });
            const res = mockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
        });
    });

    describe('getDrivers', () => {

        test('Should return list of drivers (200)', async () => {
         
            const fakeDrivers = [
                { name: 'Driver 1', email: 'd1@test.com' },
                { name: 'Driver 2', email: 'd2@test.com' }
            ];
            mockSelect.mockResolvedValue(fakeDrivers); 

            const req = mockRequest();
            const res = mockResponse();

            await getDrivers(req, res);

            expect(mockFind).toHaveBeenCalledWith({ role: 'driver' });
            expect(mockSelect).toHaveBeenCalledWith('name email');
            expect(res.json).toHaveBeenCalledWith({
                count: 2,
                drivers: fakeDrivers
            });
        });

        test('Should handle database errors (500)', async () => {

            mockFind.mockImplementation(() => {
                throw new Error('DB Error');
            });

            const req = mockRequest();
            const res = mockResponse();

            await getDrivers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
        });
    });

});
