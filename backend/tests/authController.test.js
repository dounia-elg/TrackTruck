import { jest } from "@jest/globals";

const mockFindOne = jest.fn();
const mockFind = jest.fn();
const mockSave = jest.fn();
const mockSelect = jest.fn();

const MockUser = jest.fn().mockImplementation((data) => ({
  ...data,
  _id: "123",
  save: mockSave,
}));

MockUser.findOne = mockFindOne;
MockUser.find = mockFind;

mockFind.mockReturnValue({
  select: mockSelect,
});

jest.unstable_mockModule("../models/User.js", () => ({
  default: MockUser,
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: jest.fn().mockResolvedValue("hashed_password"),
    compare: jest.fn().mockResolvedValue(true),
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn().mockReturnValue("fake_token"),
  },
}));

const { register, login, getDrivers } = await import(
  "../controllers/authController.js"
);

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("Auth Controller – Unit Tests ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("register – success", async () => {
    mockFindOne.mockResolvedValue(null);

    const req = {
      body: {
        email: "test@test.com",
        password: "123",
        name: "Test",
      },
    };
    const res = mockRes();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User created successfully",
        token: "fake_token",
      })
    );
  });

  test("login – success", async () => {
    mockFindOne.mockResolvedValue({
      _id: "123",
      email: "test@test.com",
      password: "hashed",
      role: "driver",
      name: "Test",
    });

    const req = {
      body: { email: "test@test.com", password: "123" },
    };
    const res = mockRes();

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Login successful",
        token: "fake_token",
      })
    );
  });

  test("getDrivers – success", async () => {
    mockSelect.mockResolvedValue([{ name: "Driver 1", email: "d1@test.com" }]);

    const req = {};
    const res = mockRes();

    await getDrivers(req, res);

    expect(res.json).toHaveBeenCalledWith({
      count: 1,
      drivers: [{ name: "Driver 1", email: "d1@test.com" }],
    });
  });

  test("register – user already exists", async () => {
    mockFindOne.mockResolvedValue({ email: "existing@test.com" });

    const req = {
      body: { email: "existing@test.com", password: "123" },
    };
    const res = mockRes();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "User already exists" });
  });

  test("register – database error", async () => {
    mockFindOne.mockRejectedValue(new Error("DB Error"));

    const req = {
      body: { email: "test@test.com", password: "123" },
    };
    const res = mockRes();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("login – invalid credentials (user not found)", async () => {
    mockFindOne.mockResolvedValue(null);

    const req = {
      body: { email: "notfound@test.com", password: "123" },
    };
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  test("login – database error", async () => {
    mockFindOne.mockRejectedValue(new Error("DB Error"));

    const req = {
      body: { email: "test@test.com", password: "123" },
    };
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("getDrivers – database error", async () => {
    mockFind.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("DB Error")),
    });

    const req = {};
    const res = mockRes();

    await getDrivers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
