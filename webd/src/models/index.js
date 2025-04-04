const { Sequelize } = require("sequelize");

const storagePath = process.env.DB_STORAGE || "./database.sqlite";
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storagePath,
  logging: false,
});

const Event = require("./event")(sequelize);
const Ticket = require("./ticket")(sequelize);

// Association Event <-> Ticket
Event.hasMany(Ticket, { foreignKey: "eventId" });
Ticket.belongsTo(Event, { foreignKey: "eventId" });

// Synchronisation de la base de données
sequelize.sync();

module.exports = { sequelize, Event, Ticket };
