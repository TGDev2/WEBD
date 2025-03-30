document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = "";

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Stockage du token pour les appels futurs à l'API
      localStorage.setItem("token", data.token);
      messageDiv.textContent = "Connexion réussie !";
    } else {
      messageDiv.textContent = data.message || "Échec de la connexion.";
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    messageDiv.textContent = "Une erreur est survenue. Veuillez réessayer.";
  }
});
