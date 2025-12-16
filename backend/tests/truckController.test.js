import { jest } from '@jest/globals';


const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockSort = jest.fn();


const MockTruck = jest.fn().mockImplementation((data) => {
    return {
        ...data,
        _id: 'new_truck_id',
        save: mockSave
    }; 
});

MockTruck.find = mockFind;
MockTruck.findById = mockFindById;
MockTruck.findByIdAndUpdate = mockFindByIdAndUpdate;
MockTruck.findByIdAndDelete = mockFindByIdAndDelete;

mockFind.mockReturnValue({
    sort: mockSort
});

jest.unstable_mockModule('../models/Truck.js', () => ({
    default: MockTruck
}));


const {
    createTruck,
    getAllTrucks,
    getTruckById,
    updateTruck,
    deleteTruck
} = await import('../controllers/truckController.js');

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

describe('Truck Controller Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createTruck', () => {
        test('Should create a truck successfully (201)', async () => {
            const req = mockRequest({
                immatriculation: '123-ABC',
                modele: 'Volvo',
                capaciteCarburant: 500,
                kilometrage: 10000,
                statut: 'disponible'
            });
            const res = mockResponse();

            await createTruck(req, res);

            expect(MockTruck).toHaveBeenCalledWith(expect.objectContaining({
                immatriculation: '123-ABC',
                modele: 'Volvo'
            }));
            
            expect(mockSave).toHaveBeenCalled();
            
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Camion créé avec succès'
            }));
        });

        test('Should handle validation errors (500)', async () => {
            mockSave.mockRejectedValue(new Error('Validation Error'));

            const req = mockRequest({ immatriculation: '' }); 
            const res = mockResponse();

            await createTruck(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Validation Error' });
        });
    });

    describe('getAllTrucks', () => {
        test('Should return all trucks sorted by date (200)', async () => {
            const fakeTrucks = [{ immatriculation: 'A' }, { immatriculation: 'B' }];
            mockSort.mockResolvedValue(fakeTrucks);

            const req = mockRequest({}, {}, {}); 
            const res = mockResponse();

            await getAllTrucks(req, res);

            expect(mockFind).toHaveBeenCalledWith({});
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(res.json).toHaveBeenCalledWith({
                count: 2,
                trucks: fakeTrucks
            });
        });

        test('Should filter trucks by statut', async () => {
            mockSort.mockResolvedValue([]);
            const req = mockRequest({}, {}, { statut: 'en maintenance' });
            const res = mockResponse();

            await getAllTrucks(req, res);

            expect(mockFind).toHaveBeenCalledWith({ statut: 'en maintenance' });
        });
    });

    describe('getTruckById', () => {
        test('Should return truck if found (200)', async () => {
            const fakeTruck = { _id: '123', modele: 'Volvo' };
            mockFindById.mockResolvedValue(fakeTruck);

            const req = mockRequest({}, { id: '123' });
            const res = mockResponse();

            await getTruckById(req, res);

            expect(mockFindById).toHaveBeenCalledWith('123');
            expect(res.json).toHaveBeenCalledWith(fakeTruck);
        });

        test('Should return 404 if not found', async () => {
            mockFindById.mockResolvedValue(null);

            const req = mockRequest({}, { id: '999' });
            const res = mockResponse();

            await getTruckById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Camion non trouvé' });
        });
    });

    describe('updateTruck', () => {
        test('Should update truck successfully (200)', async () => {
            const updatedTruck = { _id: '123', modele: 'New Model' };
            mockFindByIdAndUpdate.mockResolvedValue(updatedTruck);

            const req = mockRequest({ modele: 'New Model' }, { id: '123' });
            const res = mockResponse();

            await updateTruck(req, res);

            expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
                '123',
                expect.objectContaining({ modele: 'New Model' }),
                expect.objectContaining({ new: true, runValidators: true })
            );
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Camion mis à jour avec succès',
                truck: updatedTruck
            }));
        });

        test('Should return 404 if truck to update does not exist', async () => {
            mockFindByIdAndUpdate.mockResolvedValue(null);

            const req = mockRequest({}, { id: '999' });
            const res = mockResponse();

            await updateTruck(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteTruck', () => {
        test('Should delete truck successfully (200)', async () => {
            const deletedTruck = { _id: '123' };
            mockFindByIdAndDelete.mockResolvedValue(deletedTruck);

            const req = mockRequest({}, { id: '123' });
            const res = mockResponse();

            await deleteTruck(req, res);

            expect(mockFindByIdAndDelete).toHaveBeenCalledWith('123');
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Camion supprimé avec succès'
            }));
        });

        test('Should return 404 if truck to delete does not exist', async () => {
            mockFindByIdAndDelete.mockResolvedValue(null);

            const req = mockRequest({}, { id: '999' });
            const res = mockResponse();

            await deleteTruck(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
