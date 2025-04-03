const languageSelect = document.getElementById("languageSelect");

// Au chargement, on définit la langue depuis localStorage si existante
document.addEventListener("DOMContentLoaded", () => {
  const storedLanguage = localStorage.getItem("preferredLanguage") || "en";
  languageSelect.value = storedLanguage;
});

// Quand l'utilisateur change la sélection, on met à jour le localStorage
languageSelect.addEventListener("change", () => {
  localStorage.setItem("preferredLanguage", languageSelect.value);
});

// Récupération de la langue préférée
function getSelectedLanguage() {
  return localStorage.getItem("preferredLanguage") || "en";
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = "";

  // On récupère la langue sélectionnée
  const selectedLanguage = getSelectedLanguage();

  try {
    // Utilisation d'une URL relative pour passer par le load balancer
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": selectedLanguage,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Stockage du token
      localStorage.setItem("token", data.token);
      messageDiv.textContent = "Connexion réussie !";

      // Vérifier si l’utilisateur est Admin ou EventCreator et afficher le lien en conséquence
      const isAdminOrCreator = checkUserRole(data.token, [
        "Admin",
        "EventCreator",
      ]);
      if (isAdminOrCreator) {
        document.getElementById("adminLinkContainer").style.display = "block";
      }
      setTimeout(() => {
        window.location.href = "events.html";
      }, 1000);
    } else {
      messageDiv.textContent = data.message || "Échec de la connexion.";
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    messageDiv.textContent = "Une erreur est survenue. Veuillez réessayer.";
  }
});

function checkUserRole(token, allowedRoles) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadDecoded = atob(payloadBase64);
    const payload = JSON.parse(payloadDecoded);
    return allowedRoles.includes(payload.role);
  } catch (error) {
    console.error("Could not parse token:", error);
    return false;
  }
}
