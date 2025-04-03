const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("../src/index");
const { User } = require("../src/models");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

describe("User CRUD Endpoints", () => {
  let adminUser;
  let adminToken;
  let regularUser;
  let userIdToDeleteOrUpdate;

  beforeAll(async () => {
    // Nettoyage initial
    await User.destroy({ where: {} });

    // Création d'un utilisateur Admin pour effectuer des appels protégés
    const hashedPassword = await bcrypt.hash("adminPass123", 10);
    adminUser = await User.create({
      email: "admin@example.com",
      password: hashedPassword,
      role: "Admin",
    });

    // Génération du token Admin
    adminToken = jwt.sign(
      { id: adminUser.id, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Création d'un utilisateur régulier en base (pour tester la liste, etc.)
    const hashedUserPassword = await bcrypt.hash("userPass123", 10);
    regularUser = await User.create({
      email: "regular@example.com",
      password: hashedUserPassword,
      role: "User",
    });
  });

  afterAll(async () => {
    // Nettoyage de la base de données après tous les tests
    await User.destroy({ where: {} });
  });

  describe("POST /api/users (create new user)", () => {
    it("should create a new user when called by an Admin", async () => {
      const newUserData = {
        email: "newuser@example.com",
        password: "newUserPass",
        role: "User",
      };

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("Accept-Language", "en")
        .send(newUserData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "User created successfully");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("id");
      userIdToDeleteOrUpdate = res.body.user.id; // Pour les tests suivants
    });

    it("should not allow creation of a user if the requester is not Admin", async () => {
      // Tentative de création de user avec le token d’un utilisateur régulier
      const newUserData = {
        email: "anotheruser@example.com",
        password: "somePassword",
        role: "User",
      };

      const tokenRegular = jwt.sign(
        { id: regularUser.id, role: regularUser.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${tokenRegular}`)
        .set("Accept-Language", "en")
        .send(newUserData);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty(
        "message",
        "Forbidden: Insufficient rights"
      );
    });
  });

  describe("GET /api/users (list all users)", () => {
    it("should return a list of users for Admin", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("Accept-Language", "en");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "List of users");
      expect(Array.isArray(res.body.users)).toBe(true);
      // On s’attend à trouver au moins adminUser et regularUser
      const userEmails = res.body.users.map((u) => u.email);
      expect(userEmails).toContain("admin@example.com");
      expect(userEmails).toContain("regular@example.com");
    });

    it("should fail for a non-admin user", async () => {
      const tokenRegular = jwt.sign(
        { id: regularUser.id, role: regularUser.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${tokenRegular}`)
        .set("Accept-Language", "en");

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty(
        "message",
        "Forbidden: Insufficient rights"
      );
    });
  });

  describe("GET /api/users/:id (get one user)", () => {
    it("should retrieve a specific user by ID for Admin", async () => {
      const res = await request(app)
        .get(`/api/users/${regularUser.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("Accept-Language", "en");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "User details");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe("regular@example.com");
    });

    it("should return 404 if user not found", async () => {
      const res = await request(app)
        .get(`/api/users/999999`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("Accept-Language", "en");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });
  });

  describe("PUT /api/users/:id (update user)", () => {
    it("should update a user if Admin", async () => {
      const updateData = { email: "updateduser@example.com" };
      const res = await request(app)
        .put(`/api/users/${regularUser.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("Accept-Language", "en")
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "User updated successfully");
      expect(res.body.user.email).toBe("updateduser@example.com");
    });

    it("should return 404 if user to update does not exist", async () => {
      const res = await request(app)
        .put(`/api/users/999999`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("Accept-Language", "en")
        .send({ email: "ghost@example.com" });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });
  });

  describe("DELETE /api/users/:id (delete user)", () => {
    it("should delete a user if Admin", async () => {
      const res = await request(app)
        .delete(`/api/users/${userIdToDeleteOrUpdate}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("Accept-Language", "en");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "User deleted successfully");
    });

    it("should return 404 if user to delete does not exist", async () => {
      const res = await request(app)
        .delete(`/api/users/999999`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("Accept-Language", "en");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });
  });
});
