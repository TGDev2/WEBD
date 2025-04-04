const languageSelect = document.getElementById("languageSelect");

document.addEventListener("DOMContentLoaded", async () => {
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

document.addEventListener("DOMContentLoaded", async () => {
  const roleWarningDiv = document.getElementById("roleWarning");
  const createEventForm = document.getElementById("createEventForm");
  const eventsListDiv = document.getElementById("eventsList");

  const token = localStorage.getItem("token");
  if (!token) {
    roleWarningDiv.textContent = "Please log in first.";
    createEventForm.style.display = "none";
    return;
  }

  let userRole;
  try {
    const payload = parseJwt(token);
    userRole = payload.role;
  } catch (error) {
    console.error("Invalid token:", error);
    roleWarningDiv.textContent = "Invalid token. Please log in again.";
    createEventForm.style.display = "none";
    return;
  }

  if (userRole !== "Admin" && userRole !== "EventCreator") {
    roleWarningDiv.textContent =
      "You are not authorized to manage events. Only Admin and EventCreator can access this page.";
    createEventForm.style.display = "none";
    return;
  }

  // 1. Afficher la liste des événements
  await loadEvents();

  // 2. Gestion de la soumission du formulaire de création
  createEventForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await createEvent();
    createEventForm.reset();
    await loadEvents();
  });

  // =====================
  // FONCTIONS UTILITAIRES
  // =====================

  function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  async function loadEvents() {
    eventsListDiv.innerHTML = "Loading events...";

    const selectedLanguage = getSelectedLanguage();

    try {
      const response = await fetch("/api/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": selectedLanguage,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();

      if (!data.events || !Array.isArray(data.events)) {
        eventsListDiv.textContent = "No events found.";
        return;
      }

      eventsListDiv.innerHTML = "";
      data.events.forEach((event) => {
        const eventContainer = document.createElement("div");
        eventContainer.classList.add("event-item");

        const titleEl = document.createElement("h3");
        titleEl.textContent = event.title;

        const descEl = document.createElement("p");
        descEl.textContent = "Description: " + (event.description || "N/A");

        const maxSeatsEl = document.createElement("p");
        maxSeatsEl.textContent = `Max Seats: ${event.maxSeats}`;

        const soldSeatsEl = document.createElement("p");
        soldSeatsEl.textContent = `Sold Seats: ${event.soldSeats}`;

        const dateEl = document.createElement("p");
        dateEl.textContent = `Date: ${new Date(event.date).toLocaleString()}`;

        // Bouton Modifier
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {
          editEvent(event);
        });

        // Bouton Supprimer
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async () => {
          if (confirm("Are you sure you want to delete this event?")) {
            await deleteEvent(event.id);
            await loadEvents();
          }
        });

        eventContainer.appendChild(titleEl);
        eventContainer.appendChild(descEl);
        eventContainer.appendChild(maxSeatsEl);
        eventContainer.appendChild(soldSeatsEl);
        eventContainer.appendChild(dateEl);
        eventContainer.appendChild(editBtn);
        eventContainer.appendChild(deleteBtn);

        eventsListDiv.appendChild(eventContainer);
      });
    } catch (error) {
      console.error(error);
      eventsListDiv.textContent = "Error fetching events.";
    }
  }

  async function createEvent() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const maxSeats = Number(document.getElementById("maxSeats").value);
    const dateInput = document.getElementById("date").value;
    const date = new Date(dateInput).toISOString();

    const selectedLanguage = getSelectedLanguage();

    try {
      const response = await fetch("/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": selectedLanguage,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          maxSeats,
          date,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      const data = await response.json();
      console.log("Event created:", data);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event. Check console for details.");
    }
  }

  function editEvent(event) {
    const newTitle = prompt("New title:", event.title);
    if (newTitle === null) return;

    const newDescription = prompt("New description:", event.description || "");
    if (newDescription === null) return;

    const newMaxSeats = prompt("New max seats:", event.maxSeats);
    if (newMaxSeats === null) return;

    const newDate = prompt(
      "New date (YYYY-MM-DD HH:mm:ss):",
      new Date(event.date).toISOString().slice(0, 19).replace("T", " ")
    );
    if (newDate === null) return;

    updateEvent(event.id, {
      title: newTitle,
      description: newDescription,
      maxSeats: parseInt(newMaxSeats, 10),
      date: newDate,
    });
  }

  async function updateEvent(id, payload) {
    const selectedLanguage = getSelectedLanguage();

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": selectedLanguage,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }
      await loadEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event. Check console for details.");
    }
  }

  async function deleteEvent(id) {
    const selectedLanguage = getSelectedLanguage();

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": selectedLanguage,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event. Check console for details.");
    }
  }
});
