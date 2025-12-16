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


const { createTrip, getAllTrips } = await import('../controllers/tripController.js');

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
    });

});
