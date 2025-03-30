const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Concert Ticketing Auth Microservice API",
      version: "0.1.0",
      description: "API documentation for the authentication microservice",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Authentication Microservice Server",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
