document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = "";

  try {
    // Utilisation d'une URL relative pour éviter les problèmes de CORS via le Load Balancer
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Stockage du token
      localStorage.setItem("token", data.token);
      messageDiv.textContent = "Connexion réussie !";

      // Vérifier si l’utilisateur est admin ou eventcreator
      const isAdminOrCreator = checkUserRole(data.token, [
        "Admin",
        "EventCreator",
      ]);
      if (isAdminOrCreator) {
        document.getElementById("adminLinkContainer").style.display = "block";
      }
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
