const languageSelect = document.getElementById("languageSelect");

document.addEventListener("DOMContentLoaded", () => {
  // Charger la langue stockée
  const storedLanguage = localStorage.getItem("preferredLanguage") || "en";
  languageSelect.value = storedLanguage;

  // Lancer la récupération des tickets
  loadUserTickets();
});

// Mettre à jour la langue en localStorage quand l’utilisateur change la sélection
languageSelect.addEventListener("change", () => {
  localStorage.setItem("preferredLanguage", languageSelect.value);
  location.reload();
});

// Récupérer la langue choisie par l’utilisateur
function getSelectedLanguage() {
  return localStorage.getItem("preferredLanguage") || "en";
}

async function loadUserTickets() {
  const ticketsListDiv = document.getElementById("ticketsList");
  const ticketsMessageDiv = document.getElementById("ticketsMessage");
  ticketsMessageDiv.textContent = "";
  ticketsListDiv.textContent = "Loading...";

  // Vérifier si on a un token
  const token = localStorage.getItem("token");
  if (!token) {
    ticketsListDiv.textContent = "Please log in first.";
    return;
  }

  const selectedLanguage = getSelectedLanguage();

  try {
    // Appeler l’endpoint /api/tickets/mine
    const response = await fetch("/api/tickets/mine", {
      method: "GET",
      headers: {
        "Accept-Language": selectedLanguage,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user tickets");
    }

    const data = await response.json();
    const tickets = data.tickets;

    if (!tickets || tickets.length === 0) {
      ticketsListDiv.textContent = "You have no tickets yet.";
      return;
    }

    // Vider la zone d’affichage
    ticketsListDiv.innerHTML = "";

    // Parcourir chaque ticket et l’afficher
    tickets.forEach((ticket) => {
      const ticketDiv = document.createElement("div");
      ticketDiv.classList.add("ticket-item");

      const ticketNumberEl = document.createElement("h3");
      ticketNumberEl.textContent = `Ticket #${ticket.ticketNumber}`;

      const purchaseDateEl = document.createElement("p");
      const purchaseDate = new Date(ticket.purchaseDate).toLocaleString();
      purchaseDateEl.textContent = `Purchased on: ${purchaseDate}`;

      // Extraire éventuellement des infos sur l’événement
      const eventInfoEl = document.createElement("p");
      if (ticket.Event) {
        const eventDate = new Date(ticket.Event.date).toLocaleString();
        eventInfoEl.textContent = `Event: ${ticket.Event.title} (on ${eventDate})`;
      } else {
        eventInfoEl.textContent = "No event info.";
      }

      ticketDiv.appendChild(ticketNumberEl);
      ticketDiv.appendChild(purchaseDateEl);
      ticketDiv.appendChild(eventInfoEl);

      ticketsListDiv.appendChild(ticketDiv);
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    ticketsListDiv.textContent = "An error occurred while loading tickets.";
  }
}
