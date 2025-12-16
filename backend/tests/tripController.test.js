import { jest } from '@jest/globals';

const mockSave = jest.fn();
const mockFind = jest.fn();
const mockTripFindById = jest.fn();
const mockPopulate = jest.fn();
const mockSort = jest.fn();


const mockUserFindById = jest.fn();
const mockTruckFindById = jest.fn();


const MockTrip = jest.fn().mockImplementation((data) => {
    return {
        ...data,
        _id: 'new_trip_id',
        save: mockSave
    };
});
MockTrip.find = mockFind;
MockTrip.findById = mockTripFindById;


const mockQueryObj = {
    populate: mockPopulate,
    sort: mockSort
};
mockFind.mockReturnValue(mockQueryObj);
mockTripFindById.mockReturnValue(mockQueryObj);

mockPopulate.mockReturnValue(mockQueryObj);


jest.unstable_mockModule('../models/Trip.js', () => ({ default: MockTrip }));
jest.unstable_mockModule('../models/User.js', () => ({ default: { findById: mockUserFindById } }));
jest.unstable_mockModule('../models/Truck.js', () => ({ default: { findById: mockTruckFindById } }));

mockSort.mockReturnValue(mockQueryObj);


const { createTrip, getAllTrips, updateTrip, deleteTrip, updateTripStatus, getMyTrips } = await import('../controllers/tripController.js');

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

describe('Trip Controller Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createTrip', () => {

        test('Should create a trip successfully (201)', async () => {

            mockUserFindById.mockResolvedValue({ _id: 'driver_1', role: 'driver' });
            mockTruckFindById.mockResolvedValue({ _id: 'truck_1' });

            mockQueryObj.then = (resolve) => resolve({ _id: 'new_trip_id', status: 'populated' });

            const req = mockRequest({
                lieuDepart: 'Paris',
                lieuArrivee: 'Lyon',
                chauffeur: 'driver_1',
                camion: 'truck_1'
            });
            const res = mockResponse();

            await createTrip(req, res);

            expect(mockUserFindById).toHaveBeenCalledWith('driver_1');
            expect(mockTruckFindById).toHaveBeenCalledWith('truck_1');
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

        test('Should fail if driver invalide (400)', async () => {

            mockUserFindById.mockResolvedValue(null);

            const req = mockRequest({ chauffeur: 'unknown' });
            const res = mockResponse();

            await createTrip(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Chauffeur invalide' });
        });
    });

    describe('getAllTrips', () => {
        test('Should return list of trips with populations (200)', async () => {

            mockQueryObj.then = (resolve) => resolve([{ _id: 't1' }, { _id: 't2' }]);

            const req = mockRequest();
            const res = mockResponse();

            await getAllTrips(req, res);

            expect(mockFind).toHaveBeenCalled();

            expect(mockPopulate).toHaveBeenCalledTimes(3);
            expect(mockSort).toHaveBeenCalledWith({ dateDepart: -1 });

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                count: 2
            }));
        });

        test('Should filter trips by status', async () => {
            mockQueryObj.then = (resolve) => resolve([{ _id: 't1', statut: 'en cours' }]);

            const req = mockRequest({}, {}, { statut: 'en cours' });
            const res = mockResponse();

            await getAllTrips(req, res);

            expect(mockFind).toHaveBeenCalledWith({ statut: 'en cours' });
        });

        test('Should handle database errors', async () => {
            mockFind.mockImplementation(() => {
                throw new Error('Database error');
            });

            const req = mockRequest();
            const res = mockResponse();

            await getAllTrips(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    test('Should fail if truck not found (404)', async () => {
        mockUserFindById.mockResolvedValue({ _id: 'driver_1', role: 'driver' });
        mockTruckFindById.mockResolvedValue(null);

        const req = mockRequest({
            chauffeur: 'driver_1',
            camion: 'invalid_truck'
        });
        const res = mockResponse();

        await createTrip(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Camion non trouvé' });
    });

    test('Should handle createTrip database errors', async () => {
        mockUserFindById.mockRejectedValue(new Error('DB Error'));

        const req = mockRequest({ chauffeur: 'driver_1' });
        const res = mockResponse();

        await createTrip(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    describe('updateTrip', () => {
        test('Should update trip successfully', async () => {
            const MockTripWithMethods = {
                findByIdAndUpdate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnThis(),
                    then: (resolve) => resolve({ _id: 'trip_1', statut: 'en cours' })
                })
            };
            MockTrip.findByIdAndUpdate = MockTripWithMethods.findByIdAndUpdate;

            const req = mockRequest({ statut: 'en cours' }, { id: 'trip_1' });
            const res = mockResponse();

            await updateTrip(req, res);

            expect(MockTrip.findByIdAndUpdate).toHaveBeenCalledWith(
                'trip_1',
                { statut: 'en cours' },
                { new: true, runValidators: true }
            );
            expect(res.json).toHaveBeenCalled();
        });

        test('Should return 404 if trip not found', async () => {
            MockTrip.findByIdAndUpdate = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                then: (resolve) => resolve(null)
            });

            const req = mockRequest({ statut: 'en cours' }, { id: 'invalid_id' });
            const res = mockResponse();

            await updateTrip(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteTrip', () => {
        test('Should delete trip successfully', async () => {
            MockTrip.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'trip_1' });

            const req = mockRequest({}, { id: 'trip_1' });
            const res = mockResponse();

            await deleteTrip(req, res);

            expect(MockTrip.findByIdAndDelete).toHaveBeenCalledWith('trip_1');
            expect(res.json).toHaveBeenCalled();
        });

        test('Should return 404 if trip not found', async () => {
            MockTrip.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            const req = mockRequest({}, { id: 'invalid_id' });
            const res = mockResponse();

            await deleteTrip(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getMyTrips', () => {
        test('Should return driver trips', async () => {
            mockQueryObj.then = (resolve) => resolve([{ _id: 't1' }, { _id: 't2' }]);

            const req = { user: { id: 'driver_1' }, query: {} };
            const res = mockResponse();

            await getMyTrips(req, res);

            expect(mockFind).toHaveBeenCalledWith({ chauffeur: 'driver_1' });
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('updateTripStatus', () => {
        test('Should update trip status as admin', async () => {
            const tripMock = {
                _id: 'trip_1',
                chauffeur: 'driver_1',
                statut: 'planifié',
                save: jest.fn()
            };
            MockTrip.findById = jest.fn().mockResolvedValue(tripMock);
            mockTripFindById.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                then: (resolve) => resolve({ _id: 'trip_1', statut: 'en cours' })
            });

            const req = {
                params: { id: 'trip_1' },
                body: { statut: 'en cours' },
                user: { role: 'admin' }
            };
            const res = mockResponse();

            await updateTripStatus(req, res);

            expect(tripMock.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalled();
        });

        test('Should return 404 if trip not found', async () => {
            MockTrip.findById = jest.fn().mockResolvedValue(null);

            const req = {
                params: { id: 'invalid_id' },
                body: { statut: 'en cours' },
                user: { role: 'admin' }
            };
            const res = mockResponse();

            await updateTripStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

});
