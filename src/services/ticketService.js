const { Ticket, Event } = require("../models");

const buyTicket = async (userId, eventId) => {
  // Récupération de l'événement
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  // Vérification de la disponibilité
  if (event.soldSeats >= event.maxSeats) {
    throw new Error("Event is sold out");
  }
  // Incrémenter le nombre de billets vendus
  event.soldSeats += 1;
  await event.save();

  // Création du billet unique
  const ticket = await Ticket.create({
    eventId: event.id,
    userId,
    purchaseDate: new Date().toISOString()
  });

  // Simulation d'envoi asynchrone de confirmation (email/SMS)
  setTimeout(() => {
    console.log(
      `Confirmation sent for ticket ID ${ticket.id} to user ${ticket.userId}`
    );
  }, 1000);

  return ticket;
};

module.exports = {
  buyTicket,
};
