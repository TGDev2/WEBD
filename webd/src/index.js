const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const eventRoutes = require("./routes/eventRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const { swaggerUi, swaggerSpec } = require("./swagger");
const i18nMiddleware = require("./middlewares/i18nMiddleware");
const logger = require("./utils/logger");
const { sequelize } = require("./models");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(i18nMiddleware);

// Documentation Swagger accessible sur /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint de vérification de l'état de l'application
app.get("/health", (req, res) => res.send({ status: "OK" }));

// Routes principales de l'API
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);

async function startServer() {
  try {
    await sequelize.sync();
    logger.info("Database synchronized");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));
  } catch (error) {
    logger.error("Failed to synchronize database:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
