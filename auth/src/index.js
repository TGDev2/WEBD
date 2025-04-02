const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const { swaggerUi, swaggerSpec } = require("./swagger");
const i18nMiddleware = require("./middlewares/i18nMiddleware");
const logger = require("./utils/logger");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(i18nMiddleware);

// Documentation Swagger accessible sur /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoints d'authentification
app.use("/api/auth", authRoutes);

// Endpoint de vérification de l'état de l'application
app.get("/health", (req, res) => res.json({ status: "OK" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Authentication microservice listening on port ${PORT}`);
});

module.exports = app;
