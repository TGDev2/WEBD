const request = require("supertest");
const app = require("../src/index");

describe("Health Check Endpoint", () => {
  it("should return OK status", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");
  });
});
