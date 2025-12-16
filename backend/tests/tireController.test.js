import { jest } from '@jest/globals';

const mockSave = jest.fn();
const mockFind = jest.fn();
const mockTruckFindById = jest.fn();
const mockPopulate = jest.fn();
const mockSort = jest.fn();

const MockTire = jest.fn().mockImplementation((data) => {
    return {
        ...data,
        _id: 'new_tire_id',
        save: mockSave
    };
});
MockTire.find = mockFind;

mockFind.mockReturnValue({
    populate: mockPopulate
});
mockPopulate.mockReturnValue({
    sort: mockSort
});

const MockTruck = {
    findById: mockTruckFindById
};

jest.unstable_mockModule('../models/Tire.js', () => ({
    default: MockTire
}));

jest.unstable_mockModule('../models/Truck.js', () => ({
    default: MockTruck
}));

const { createTire, getAllTires, updateTire, deleteTire } = await import('../controllers/tireController.js');

const mockRequest = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Tire Controller Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createTire', () => {

        test('Should create a tire successfully if truck exists (201)', async () => {
            
            mockTruckFindById.mockResolvedValue({ _id: 'truck_123' });

            const req = mockRequest({
                camion: 'truck_123',
                position: 'AVG',
                marque: 'Michelin',
                reference: 'X Multi Z',
                dateInstallation: '2023-01-01',
                kilometrageInstallation: 50000
            });
            const res = mockResponse();

            await createTire(req, res);

            expect(mockTruckFindById).toHaveBeenCalledWith('truck_123');
            expect(MockTire).toHaveBeenCalledWith(expect.objectContaining({
                position: 'AVG',
                marque: 'Michelin'
            }));
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Pneu installé avec succès'
            }));
        });

        test('Should fail if truck does not exist (404)', async () => {
           
            mockTruckFindById.mockResolvedValue(null);

            const req = mockRequest({ camion: 'unknown_truck' });
            const res = mockResponse();

            await createTire(req, res);

            expect(mockSave).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Camion non trouvé' });
        });
    });

    describe('getAllTires', () => {
        test('Should return list of tires (200)', async () => {
            const fakeTires = [{ marque: 'Michelin' }, { marque: 'Bridgestone' }];
            mockSort.mockResolvedValue(fakeTires);

            const req = mockRequest();
            const res = mockResponse();

            await getAllTires(req, res);

            expect(mockFind).toHaveBeenCalled();
            expect(mockPopulate).toHaveBeenCalledWith("camion", "immatriculation modele");
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });

            expect(res.json).toHaveBeenCalledWith({
                count: 2,
                tires: fakeTires
            });
        });

        test('Should handle database errors', async () => {
            mockFind.mockImplementation(() => {
                throw new Error('DB Error');
            });

            const req = mockRequest();
            const res = mockResponse();

            await getAllTires(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    test('Should handle createTire database errors', async () => {
        mockTruckFindById.mockRejectedValue(new Error('DB Error'));

        const req = mockRequest({ camion: 'truck_123' });
        const res = mockResponse();

        await createTire(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    describe('updateTire', () => {
        test('Should update tire successfully', async () => {
            MockTire.findByIdAndUpdate = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue({ _id: 'tire_1', usure: 50 })
            });

            const req = mockRequest({ usure: 50 }, { id: 'tire_1' });
            const res = mockResponse();

            await updateTire(req, res);

            expect(MockTire.findByIdAndUpdate).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalled();
        });

        test('Should return 404 if tire not found', async () => {
            MockTire.findByIdAndUpdate = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            const req = mockRequest({ usure: 50 }, { id: 'invalid_id' });
            const res = mockResponse();

            await updateTire(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteTire', () => {
        test('Should delete tire successfully', async () => {
            MockTire.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'tire_1' });

            const req = mockRequest({}, { id: 'tire_1' });
            const res = mockResponse();

            await deleteTire(req, res);

            expect(MockTire.findByIdAndDelete).toHaveBeenCalledWith('tire_1');
            expect(res.json).toHaveBeenCalled();
        });

        test('Should return 404 if tire not found', async () => {
            MockTire.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            const req = mockRequest({}, { id: 'invalid_id' });
            const res = mockResponse();

            await deleteTire(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

});
