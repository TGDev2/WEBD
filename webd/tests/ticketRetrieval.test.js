const request = require("supertest");
const app = require("../src/index");
const { User, Event, Ticket } = require("../src/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

describe("Ticket Retrieval Endpoint", () => {
  let testUser;
  let userToken;
  let testEvent;

  beforeAll(async () => {
    await Ticket.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await User.destroy({ where: {} });

    testUser = await User.create({
      email: "user@test.com",
      password: await bcrypt.hash("password", 10),
      role: "User",
    });

    userToken = jwt.sign({ id: testUser.id, role: testUser.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Création d'un événement de test
    testEvent = await Event.create({
      title: "Test Event",
      description: "Event for ticket retrieval test",
      maxSeats: 10,
      soldSeats: 0,
      date: new Date(),
    });

    await request(app)
      .post("/api/tickets/buy")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept-Language", "en")
      .send({
        userId: testUser.id,
        eventId: testEvent.id,
        paymentInfo: { cardNumber: "1111222233334444" },
      });
  });

  afterAll(async () => {
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
      expect(ticket.userId).toBe(testUser.id);
    });
  });
});
