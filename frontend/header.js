function getSelectedLanguage() {
  return localStorage.getItem("preferredLanguage") || "en";
}

async function insertHeader() {
  const token = localStorage.getItem("token");
  const headerContainer = document.createElement("div");
  headerContainer.classList.add("header-container");

  const homeLink = `<a href="index.html" class="nav-link">Login</a>`;
  const eventsLink = `<a href="events.html" class="nav-link">Events</a>`;
  const myTicketsLink = `<a href="myTickets.html" class="nav-link">My Tickets</a>`;
  const manageEventsLink = `<a href="manageEvents.html" class="nav-link">Manage Events</a>`;
  const manageUsersLink = `<a href="manageUsers.html" class="nav-link">Manage Users</a>`;

  // By default, show only "Login" + "Events" + "My Tickets"
  let navContent = [homeLink, eventsLink, myTicketsLink];

  if (token) {
    try {
      const payload = parseJwt(token);
      // Show Manage Events if role is Admin or EventCreator
      if (payload.role === "Admin" || payload.role === "EventCreator") {
        navContent.push(manageEventsLink);
      }
      // Show Manage Users if role is Admin
      if (payload.role === "Admin") {
        navContent.push(manageUsersLink);
      }
      // Add a “Logout” link
      navContent.push(
        `<a href="#" class="nav-link" id="logoutLink">Logout</a>`
      );
    } catch (error) {
      console.error("Invalid token while building header:", error);
    }
  }

  headerContainer.innerHTML = `
      <nav class="main-nav">
        ${navContent.join(" | ")}
      </nav>
    `;

  document.body.insertBefore(headerContainer, document.body.firstChild);

  // If there's a logout link, add a click handler
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }
}

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
