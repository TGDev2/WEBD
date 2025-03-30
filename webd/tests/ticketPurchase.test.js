const request = require("supertest");
const app = require("../src/index");
const { User, Event, Ticket } = require("../src/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

describe("Ticket Purchase Process", () => {
  let adminUser;
  let adminToken;
  let testEvent;

  beforeAll(async () => {
    // Nettoyage de la base de données pour garantir l'isolation des tests
    await Ticket.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Création d'un utilisateur administrateur directement dans la base
    adminUser = await User.create({
      email: "admin@test.com",
      password: await bcrypt.hash("password", 10),
      role: "Admin",
    });

    // Génération d'un token pour l'utilisateur admin
    adminToken = jwt.sign(
      { id: adminUser.id, role: adminUser.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Création d'un événement avec une capacité maximale de 1 place
    testEvent = await Event.create({
      title: "Test Event",
      description: "An event for testing ticket purchase.",
      maxSeats: 1,
      soldSeats: 0,
      date: new Date(),
    });
  });

  afterAll(async () => {
    // Nettoyage de la base de données après les tests
    await Ticket.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  test("should purchase a ticket successfully when seats are available", async () => {
    const response = await request(app)
      .post("/api/tickets/buy")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept-Language", "en")
      .send({
        userId: adminUser.id,
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
    const response = await request(app)
      .post("/api/tickets/buy")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept-Language", "en")
      .send({
        userId: adminUser.id,
        eventId: testEvent.id,
        paymentInfo: {
          cardNumber: "1234567812345678",
        },
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Ticket purchase failed");
  });
});
