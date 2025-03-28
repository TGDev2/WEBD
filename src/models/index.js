const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
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
