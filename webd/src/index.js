const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const { swaggerUi, swaggerSpec } = require("./swagger");
const i18nMiddleware = require("./middlewares/i18nMiddleware");

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
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);

// Lancer le serveur uniquement si ce module est exécuté directement
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

module.exports = app; // Export pour les tests
