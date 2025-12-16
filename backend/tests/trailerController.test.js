import { jest } from '@jest/globals';

const mockSave = jest.fn();
const mockFind = jest.fn();
const mockPopulate = jest.fn();
const mockSort = jest.fn();

const MockTrailer = jest.fn().mockImplementation((data) => {
    return {
        ...data,
        _id: 'new_trailer_id',
        save: mockSave
    };
});

MockTrailer.find = mockFind;

mockFind.mockReturnValue({
    populate: mockPopulate
});
mockPopulate.mockReturnValue({
    sort: mockSort
});

jest.unstable_mockModule('../models/Trailer.js', () => ({
    default: MockTrailer
}));

const { createTrailer, getAllTrailers } = await import('../controllers/trailerController.js');

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

describe('Trailer Controller Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createTrailer', () => {
        test('Should create a trailer successfully (201)', async () => {
            const req = mockRequest({
                immatriculation: 'TRAILER-01',
                type: 'Frigo',
                capaciteCharge: 25000,
                statut: 'disponible'
            });
            const res = mockResponse();

            await createTrailer(req, res);

            expect(MockTrailer).toHaveBeenCalledWith(expect.objectContaining({
                immatriculation: 'TRAILER-01',
                type: 'Frigo'
            }));
           
            expect(mockSave).toHaveBeenCalled();
           
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Remorque créée avec succès'
            }));
        });

        test('Should handle errors (500)', async () => {
            mockSave.mockRejectedValue(new Error('DB Error'));

            const req = mockRequest({ immatriculation: 'TRAILER-01' });
            const res = mockResponse();

            await createTrailer(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
        });
    });

    describe('getAllTrailers', () => {
        test('Should return list of trailers (200)', async () => {
            const fakeTrailers = [{ immatriculation: 'T1' }, { immatriculation: 'T2' }];
            mockSort.mockResolvedValue(fakeTrailers);

            const req = mockRequest();
            const res = mockResponse();

            await getAllTrailers(req, res);

            expect(mockFind).toHaveBeenCalled();
            
            expect(mockPopulate).toHaveBeenCalledWith("camionAssocie", "immatriculation modele");
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });

            expect(res.json).toHaveBeenCalledWith({
                count: 2,
                trailers: fakeTrailers
            });
        });
    });

});
