const languageSelect = document.getElementById("languageSelect");

document.addEventListener("DOMContentLoaded", () => {
  const storedLanguage = localStorage.getItem("preferredLanguage") || "en";
  languageSelect.value = storedLanguage;
});

languageSelect.addEventListener("change", () => {
  localStorage.setItem("preferredLanguage", languageSelect.value);
  location.reload();
});

function getSelectedLanguage() {
  return localStorage.getItem("preferredLanguage") || "en";
}

// Récupération de la liste des événements au chargement de la page
document.addEventListener("DOMContentLoaded", async () => {
  const eventsListDiv = document.getElementById("eventsList");
  const purchaseMessageDiv = document.getElementById("purchaseMessage");
  const token = localStorage.getItem("token");

  if (!token) {
    eventsListDiv.textContent = "Please log in first.";
    return;
  }

  const selectedLanguage = getSelectedLanguage();

  try {
    const response = await fetch("/api/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": selectedLanguage,
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

  async function buyTicket(eventId) {
    purchaseMessageDiv.textContent = "";

    const selectedLanguage = getSelectedLanguage();

    if (!token) {
      purchaseMessageDiv.textContent = "Please log in first.";
      return;
    }

    try {
      const userId = await getUserIdFromToken(token);
      const response = await fetch("/api/tickets/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": selectedLanguage,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          eventId: eventId,
          paymentInfo: {
            cardNumber: "1111222233334444",
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        purchaseMessageDiv.textContent =
          data.message || "Ticket purchased successfully!";
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

  function getUserIdFromToken(token) {
    const payloadBase64 = token.split(".")[1];
    const payloadDecoded = atob(payloadBase64);
    const payload = JSON.parse(payloadDecoded);
    return payload.id;
  }
});
