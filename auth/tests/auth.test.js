const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("../src/index");
const { User } = require("../src/models");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

describe("Auth Microservice Tests", () => {
  // Nettoyage de la base avant et après les tests
  beforeAll(async () => {
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
  });

  describe("Health Check", () => {
    it("should return OK status on /health", async () => {
      const response = await request(app).get("/health");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "OK" });
    });
  });

  describe("User Registration", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        email: "testuser@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(newUser)
        .set("Accept-Language", "en");

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.email).toBe(newUser.email);
    });

    it("should fail if the user already exists", async () => {
      const existingUser = {
        email: "duplicate@example.com",
        password: "password123",
      };

      // Première inscription
      await request(app).post("/api/auth/register").send(existingUser);

      // Deuxième tentative d’inscription
      const response = await request(app)
        .post("/api/auth/register")
        .send(existingUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "User already exists");
    });
  });

  describe("User Login", () => {
    let testUser;

    beforeAll(async () => {
      // Création d’un utilisateur en base pour les tests de connexion
      testUser = await User.create({
        email: "loginuser@example.com",
        password: await bcrypt.hash("secretPass1", 10),
        role: "User",
      });
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "loginuser@example.com",
          password: "secretPass1",
        })
        .set("Accept-Language", "en");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
    });

    it("should fail to login with invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "loginuser@example.com",
          password: "invalidPassword",
        })
        .set("Accept-Language", "en");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
  });
});
