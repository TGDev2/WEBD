const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/index");
const { Event, Ticket } = require("../src/models");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

describe("Ticket Purchase Process", () => {
  let adminToken;
  let testEvent;

  beforeAll(async () => {
    // Nettoyage complet de la base Tickets/Events
    await Ticket.destroy({ where: {} });
    await Event.destroy({ where: {} });

    // Générer un token Admin "falsifié" pour tester l'accès
    adminToken = jwt.sign({ id: 999, role: "Admin" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Créer un événement via /api/events
    const eventRes = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept-Language", "en")
      .send({
        title: "Test Event",
        description: "An event for testing ticket purchase.",
        maxSeats: 1,
        date: new Date().toISOString(),
      });
    expect(eventRes.statusCode).toBe(201);

    testEvent = eventRes.body.event;
  });

  afterAll(async () => {
    // Nettoyage final
    await Ticket.destroy({ where: {} });
    await Event.destroy({ where: {} });
  });

  test("should purchase a ticket successfully when seats are available", async () => {
    const response = await request(app)
      .post("/api/tickets/buy")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept-Language", "en")
      .send({
        userId: 999,
        eventId: testEvent.id,
        paymentInfo: {
          cardNumber: "1234567812345678",
        },
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("ticket");
    expect(response.body.ticket).toHaveProperty("id");
  });

  test("should fail to purchase a ticket when event is sold out", async () => {
    // Ré-essayer d'acheter un billet pour le même event => sold out
    const response = await request(app)
      .post("/api/tickets/buy")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept-Language", "en")
      .send({
        userId: 999,
        eventId: testEvent.id,
        paymentInfo: {
          cardNumber: "1234567812345678",
        },
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Ticket purchase failed");
  });
});
