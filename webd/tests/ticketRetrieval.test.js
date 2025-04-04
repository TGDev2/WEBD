const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/index");
const { User, Event, Ticket } = require("../src/models");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

describe("Ticket Retrieval Endpoint", () => {
  let adminToken;
  let adminUserId;
  let userToken;
  let testUserId;
  let testEvent;

  beforeAll(async () => {
    // Nettoyage complet de la base
    await Ticket.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await User.destroy({ where: {} });

    // 1. Générer un token Admin "falsifié" pour créer via /api/users
    adminToken = jwt.sign({ id: 999, role: "Admin" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // 2. Créer un utilisateur Admin (email unique)
    const uniqueAdminEmail = `admin${Date.now()}@test.com`;
    const adminRes = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept-Language", "en")
      .send({
        email: uniqueAdminEmail,
        password: "adminPass",
        role: "Admin",
      });
    expect(adminRes.statusCode).toBe(201);
    adminUserId = adminRes.body.user.id;

    // 3. Créer un utilisateur normal (email unique)
    const uniqueUserEmail = `user${Date.now()}@test.com`;
    const userRes = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept-Language", "en")
      .send({
        email: uniqueUserEmail,
        password: "userPass",
        role: "User",
      });
    expect(userRes.statusCode).toBe(201);
    testUserId = userRes.body.user.id;

    // 4. Générer un token pour l'utilisateur normal
    userToken = jwt.sign({ id: testUserId, role: "User" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // 5. Créer un événement via /api/events avec le token Admin
    const eventRes = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept-Language", "en")
      .send({
        title: "Test Event",
        description: "Event for ticket retrieval test",
        maxSeats: 10,
        date: new Date().toISOString(),
      });
    expect(eventRes.statusCode).toBe(201);
    testEvent = eventRes.body.event;

    // 6. Acheter un billet (user normal)
    const buyRes = await request(app)
      .post("/api/tickets/buy")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept-Language", "en")
      .send({
        userId: testUserId,
        eventId: testEvent.id,
        paymentInfo: {
          cardNumber: "1111222233334444",
        },
      });
    expect(buyRes.statusCode).toBe(201);
  });

  afterAll(async () => {
    // Nettoyage final
    await Ticket.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  test("should retrieve tickets for the authenticated user", async () => {
    const response = await request(app)
      .get("/api/tickets/mine")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept-Language", "en");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.tickets)).toBe(true);
    expect(response.body.tickets.length).toBeGreaterThan(0);

    response.body.tickets.forEach((ticket) => {
      expect(ticket.userId).toBe(testUserId);
    });
  });
});
