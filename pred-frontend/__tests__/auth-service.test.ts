import { login, register, getCurrentUser } from "../services/auth-service";

const API_URL = "http://localhost:8000/pred-backend/api";

describe("Auth Service", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should login successfully", async () => {
    const mockResponse = {
      success: true,
      message: "Login successful",
      data: {
        token: "mockToken",
        user: {
          id: 1,
          nombre: "John",
          apellido: "Doe",
          email: "john.doe@example.com",
        },
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const response = await login("john.doe@example.com", "password123");
    expect(response).toEqual(mockResponse);
  });

  it("should register successfully", async () => {
    const mockResponse = {
      success: true,
      message: "Registration successful",
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const registerData = {
      nombre: "John",
      apellido: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      cedula: "123456789",
      telefono: "1234567890",
      direccion: "123 Main St",
    };

    const response = await register(registerData);
    expect(response).toEqual(mockResponse);
  });

  it("should get current user successfully", async () => {
    const mockResponse = {
      id: 1,
      nombre: "John",
      apellido: "Doe",
      email: "john.doe@example.com",
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const response = await getCurrentUser("mockToken");
    expect(response).toEqual(mockResponse);
  });
});