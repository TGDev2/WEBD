// Récupération de la liste des événements au chargement de la page
document.addEventListener("DOMContentLoaded", async () => {
  const eventsListDiv = document.getElementById("eventsList");
  const token = localStorage.getItem("token");

  if (!token) {
    eventsListDiv.textContent = "Please log in first.";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Langue par défaut en anglais pour l'exemple
        "Accept-Language": "en",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await response.json();

    if (data.events && Array.isArray(data.events)) {
      data.events.forEach((event) => {
        const eventContainer = document.createElement("div");
        eventContainer.classList.add("event-item");

        const title = document.createElement("h2");
        title.textContent = event.title;

        const description = document.createElement("p");
        description.textContent = event.description || "No description";

        const date = document.createElement("p");
        date.textContent = `Date: ${new Date(event.date).toLocaleString()}`;

        const seats = document.createElement("p");
        seats.textContent = `Seats: ${event.soldSeats} / ${event.maxSeats}`;

        const buyButton = document.createElement("button");
        buyButton.textContent = "Buy Ticket";
        buyButton.addEventListener("click", () => buyTicket(event.id));

        eventContainer.appendChild(title);
        eventContainer.appendChild(description);
        eventContainer.appendChild(date);
        eventContainer.appendChild(seats);
        eventContainer.appendChild(buyButton);

        eventsListDiv.appendChild(eventContainer);
      });
    } else {
      eventsListDiv.textContent = "No events found.";
    }
  } catch (error) {
    console.error(error);
    eventsListDiv.textContent = "Error fetching events.";
  }
});

// Fonction d'achat de billet
async function buyTicket(eventId) {
  const purchaseMessageDiv = document.getElementById("purchaseMessage");
  purchaseMessageDiv.textContent = "";

  const token = localStorage.getItem("token");
  if (!token) {
    purchaseMessageDiv.textContent = "Please log in first.";
    return;
  }

  try {
    const userId = await getUserIdFromToken(token);
    const response = await fetch("http://localhost:3000/api/tickets/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: userId,
        eventId: eventId,
        paymentInfo: {
          // Dans un vrai cas, on demanderait les infos de carte
          cardNumber: "1111222233334444",
        },
      }),
    });

    const data = await response.json();

    if (response.ok) {
      purchaseMessageDiv.textContent =
        data.message || "Ticket purchased successfully!";
      // On pourrait recharger la liste des événements ou afficher le ticket
    } else {
      purchaseMessageDiv.textContent =
        data.message || "Ticket purchase failed.";
    }
  } catch (error) {
    console.error("Error buying ticket:", error);
    purchaseMessageDiv.textContent =
      "An error occurred during ticket purchase.";
  }
}

// Fonction utilitaire pour extraire l'ID utilisateur du token
async function getUserIdFromToken(token) {
  // Petit parse du payload JWT (sans vérification cryptographique ici)
  const payloadBase64 = token.split(".")[1];
  const payloadDecoded = atob(payloadBase64);
  const payload = JSON.parse(payloadDecoded);
  return payload.id;
}
