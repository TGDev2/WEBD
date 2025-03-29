const { Ticket, Event, sequelize } = require("../models");
const paymentService = require("./paymentService");

const buyTicket = async (userId, eventId, paymentInfo) => {
  // Simulation du paiement par carte bancaire
  const paymentResult = await paymentService.simulateCardPayment(paymentInfo, 100); // montant fixe pour l'exemple
  if (paymentResult.status !== "approved") {
    throw new Error("Payment failed");
  }

  // Démarrage de la transaction pour garantir l'intégrité des opérations
  const transaction = await sequelize.transaction();
  try {
    // Récupération de l'événement avec verrouillage pour éviter la concurrence
    const event = await Event.findByPk(eventId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!event) {
      throw new Error("Event not found");
    }
    // Vérification de la disponibilité de l'événement
    if (event.soldSeats >= event.maxSeats) {
      throw new Error("Event is sold out");
    }
    // Incrémenter le nombre de billets vendus
    event.soldSeats += 1;
    await event.save({ transaction });

    // Création du billet unique dans le cadre de la transaction
    const ticket = await Ticket.create(
      {
        eventId: event.id,
        userId,
        purchaseDate: new Date().toISOString(),
      },
      { transaction }
    );

    await transaction.commit();

    // Simulation d'envoi asynchrone de confirmation (email/SMS)
    setTimeout(() => {
      console.log(
        `Confirmation sent for ticket ID ${ticket.id} to user ${ticket.userId}`
      );
    }, 1000);

    return ticket;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  buyTicket,
};
