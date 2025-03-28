const eventService = require("./eventService");

let tickets = [];
let nextTicketId = 1;

/**
 * Permet l'achat d'un billet pour un événement donné par un utilisateur.
 * Vérifie la disponibilité, incrémente soldSeats et crée un ticket unique.
 * @param {number|string} userId - Identifiant de l'utilisateur acheteur.
 * @param {number|string} eventId - Identifiant de l'événement.
 * @returns {Object} Le billet créé.
 * @throws {Error} Si l'événement n'existe pas ou est complet.
 */
const buyTicket = (userId, eventId) => {
  // Récupération de l'événement
  const event = eventService.getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  // Vérification de la disponibilité
  if (event.soldSeats >= event.maxSeats) {
    throw new Error("Event is sold out");
  }
  // Incrémenter le nombre de billets vendus
  event.soldSeats++;

  // Création du billet unique
  const ticket = {
    id: nextTicketId++,
    eventId: event.id,
    userId,
    purchaseDate: new Date().toISOString(),
  };

  tickets.push(ticket);

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
