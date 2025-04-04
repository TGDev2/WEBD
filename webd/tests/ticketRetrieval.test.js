const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/index");
const { Event, Ticket } = require("../src/models");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

describe("Ticket Retrieval Endpoint", () => {
  let userToken;
  let testUserId = 101; // On simule un user ID
  let testEvent;

  beforeAll(async () => {
    // Nettoyage complet
    await Ticket.destroy({ where: {} });
    await Event.destroy({ where: {} });

    // Générer un token User "falsifié"
    userToken = jwt.sign({ id: testUserId, role: "User" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Créer un event
    const eventRes = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept-Language", "en")
      .send({
        title: "Test Event",
        description: "Event for ticket retrieval test",
        maxSeats: 10,
        date: new Date().toISOString(),
      });
    expect(eventRes.statusCode).toBe(201);

    testEvent = eventRes.body.event;

    // Acheter un billet (pour userId = testUserId)
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
    await Ticket.destroy({ where: {} });
    await Event.destroy({ where: {} });
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
