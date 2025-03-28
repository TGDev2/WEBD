let events = [];
let nextId = 1;

/**
 * Crée un nouvel événement.
 * @param {Object} eventData - Données de l'événement.
 * @returns {Object} L'événement créé.
 */
const createEvent = (eventData) => {
  const event = { id: nextId++, ...eventData };
  events.push(event);
  return event;
};

/**
 * Retourne la liste de tous les événements.
 * @returns {Array} Liste des événements.
 */
const getEvents = () => events;

/**
 * Retourne un événement par son identifiant.
 * @param {number|string} id - Identifiant de l'événement.
 * @returns {Object|undefined} L'événement trouvé ou undefined.
 */
const getEventById = (id) => events.find((e) => e.id === parseInt(id, 10));

/**
 * Met à jour un événement existant.
 * @param {number|string} id - Identifiant de l'événement.
 * @param {Object} eventData - Nouvelles données de l'événement.
 * @returns {Object|null} L'événement mis à jour ou null si non trouvé.
 */
const updateEvent = (id, eventData) => {
  const index = events.findIndex((e) => e.id === parseInt(id, 10));
  if (index === -1) {
    return null;
  }
  events[index] = { ...events[index], ...eventData };
  return events[index];
};

/**
 * Supprime un événement par son identifiant.
 * @param {number|string} id - Identifiant de l'événement.
 * @returns {boolean} True si l'événement a été supprimé, sinon false.
 */
const deleteEvent = (id) => {
  const index = events.findIndex((e) => e.id === parseInt(id, 10));
  if (index === -1) {
    return false;
  }
  events.splice(index, 1);
  return true;
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
