const { Sequelize } = require("sequelize");

const storagePath = process.env.DB_STORAGE || "./database.sqlite";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storagePath,
  logging: false,
});

const User = require("./user")(sequelize);
const Event = require("./event")(sequelize);
const Ticket = require("./ticket")(sequelize);

// Associations
User.hasMany(Ticket, { foreignKey: "userId" });
Ticket.belongsTo(User, { foreignKey: "userId" });

Event.hasMany(Ticket, { foreignKey: "eventId" });
Ticket.belongsTo(Event, { foreignKey: "eventId" });

// Synchronisation de la base de données
sequelize.sync();

module.exports = { sequelize, User, Event, Ticket };
