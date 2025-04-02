const { Ticket, Event, sequelize } = require("../models");
const paymentService = require("./paymentService");
const crypto = require("crypto");

const buyTicket = async (userId, eventId, paymentInfo) => {
  // Simulation du paiement par carte bancaire
  const paymentResult = await paymentService.simulateCardPayment(
    paymentInfo,
    100
  ); // Montant fixe pour l'exemple
  if (paymentResult.status !== "approved") {
    throw new Error("Payment failed");
  }

  // Démarrage de la transaction pour garantir l'intégrité des opérations
  const transaction = await sequelize.transaction();
  try {
    // Récupération de l'événement avec verrouillage
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

    // Génération d'un numéro de billet unique
    const ticketNumber = crypto.randomBytes(8).toString("hex");

    // Création du billet unique
    const ticket = await Ticket.create(
      {
        eventId: event.id,
        userId,
        purchaseDate: new Date().toISOString(),
        ticketNumber,
      },
      { transaction }
    );

    await transaction.commit();

    // Simulation d'envoi asynchrone de confirmation (email/SMS)
    const confirmationTimer = setTimeout(() => {
      console.log(
        `Confirmation sent for ticket ID ${ticket.id} to user ${ticket.userId}`
      );
    }, 1000);
    confirmationTimer.unref();

    return ticket;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getTicketsForUser = async (userId) => {
  // Inclure l'événement pour fournir plus de contexte à l'utilisateur
  return Ticket.findAll({
    where: { userId },
    include: [Event],
  });
};

module.exports = {
  buyTicket,
  getTicketsForUser,
};
