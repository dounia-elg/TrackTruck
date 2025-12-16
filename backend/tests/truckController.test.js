import { jest } from "@jest/globals";

const mockSave = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockFind = jest.fn();

const MockTruck = jest.fn().mockImplementation((data) => ({
    ...data,
    _id: "truck123",
    save: mockSave,
}));

MockTruck.findById = mockFindById;
MockTruck.findByIdAndUpdate = mockFindByIdAndUpdate;
MockTruck.findByIdAndDelete = mockFindByIdAndDelete;
MockTruck.find = mockFind;

jest.unstable_mockModule("../models/Truck.js", () => ({
    default: MockTruck,
}));

const {
    createTruck,
    updateTruck,
    deleteTruck,
    getAllTrucks,
    getTruckById,
} = await import("../controllers/truckController.js");


const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res;
};


describe("Truck Controller – Unit Tests (ESM Safe)", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("createTruck – success", async () => {
        const req = {
            body: {
                immatriculation: "ABC123",
                modele: "Volvo",
                capaciteCarburant: 500,
                kilometrage: 10000,
                statut: "active",
                maintenanceRules: [],
            },
        };
        const res = mockRes();

        await createTruck(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Camion créé avec succès",
                truck: expect.objectContaining({ immatriculation: "ABC123" }),
            })
        );
    });


    test("updateTruck – success", async () => {
        mockFindByIdAndUpdate.mockResolvedValue({
            _id: "truck123",
            immatriculation: "XYZ789",
        });

        const req = {
            params: { id: "truck123" },
            body: { immatriculation: "XYZ789" },
        };
        const res = mockRes();

        await updateTruck(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Camion mis à jour avec succès",
                truck: expect.objectContaining({ immatriculation: "XYZ789" }),
            })
        );
    });


    test("deleteTruck – success", async () => {
        mockFindByIdAndDelete.mockResolvedValue({ _id: "truck123" });

        const req = { params: { id: "truck123" } };
        const res = mockRes();

        await deleteTruck(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Camion supprimé avec succès",
                truck: expect.objectContaining({ _id: "truck123" }),
            })
        );
    });


    test("getAllTrucks – success", async () => {
        mockFind.mockReturnValue({
            sort: jest.fn().mockResolvedValue([
                { immatriculation: "ABC123" },
            ]),
        });

        const req = { query: {} };
        const res = mockRes();

        await getAllTrucks(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                count: 1,
                trucks: [{ immatriculation: "ABC123" }],
            })
        );
    });


    test("getTruckById – success", async () => {
        mockFindById.mockResolvedValue({ _id: "truck123" });

        const req = { params: { id: "truck123" } };
        const res = mockRes();

        await getTruckById(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ _id: "truck123" })
        );
    });

    test("updateTruck – truck not found", async () => {
        mockFindByIdAndUpdate.mockResolvedValue(null);

        const req = {
            params: { id: "invalid_id" },
            body: { immatriculation: "XYZ789" },
        };
        const res = mockRes();

        await updateTruck(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Camion non trouvé" });
    });

    test("deleteTruck – truck not found", async () => {
        mockFindByIdAndDelete.mockResolvedValue(null);

        const req = { params: { id: "invalid_id" } };
        const res = mockRes();

        await deleteTruck(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("getTruckById – truck not found", async () => {
        mockFindById.mockResolvedValue(null);

        const req = { params: { id: "invalid_id" } };
        const res = mockRes();

        await getTruckById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("createTruck – database error", async () => {
        mockSave.mockRejectedValue(new Error("DB Error"));

        const req = {
            body: { immatriculation: "ABC123" },
        };
        const res = mockRes();

        await createTruck(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    test("getAllTrucks – database error", async () => {
        mockFind.mockImplementation(() => {
            throw new Error("DB Error");
        });

        const req = { query: {} };
        const res = mockRes();

        await getAllTrucks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});
