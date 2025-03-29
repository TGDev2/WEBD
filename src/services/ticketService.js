const { Ticket, Event } = require("../models");
const paymentService = require("./paymentService");

const buyTicket = async (userId, eventId, paymentInfo) => {
  // Simulation du paiement par carte bancaire
  const paymentResult = await paymentService.simulateCardPayment(
    paymentInfo,
    100
  ); // montant fixe pour l'exemple
  if (paymentResult.status !== "approved") {
    throw new Error("Payment failed");
  }

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
    purchaseDate: new Date().toISOString(),
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
